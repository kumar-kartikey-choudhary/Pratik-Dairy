package com.pratikdairy.cart.service.impl;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.cart.entity.CartItem;
import com.pratikdairy.cart.repository.CartItemRepository;
import com.pratikdairy.cart.service.CartService;
import com.pratikdairy.parent.utility.MapperUtility;
import com.pratikdairy.product.controller.ProductController;
import com.pratikdairy.product.dto.ProductDto;
import com.pratikdairy.product.model.Product;
import com.pratikdairy.user.controller.UserController;
import com.pratikdairy.user.jwt.JwtAuthFilter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductController controller;


    @Autowired
    public CartServiceImpl( CartItemRepository cartItemRepository,
                           ProductController controller)
    {
        this.cartItemRepository = cartItemRepository;
        this.controller = controller;
    }

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return auth.getName();
    }


    @Override
    @Transactional
    public boolean addItemToCart(AddToCart request) {
        log.info("Inside @class CartServiceImpl @method addItemToCart Adding item {} to cart", request.getProductId());
        String username = this.getUsername();
        ResponseEntity<ProductDto> response = controller.find(request.getProductId());
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("ProductNotFoundException: Could not fetch product details.");
        }
        ProductDto productDto = response.getBody();
        Product product;
        try{
            product = MapperUtility.sourceToTarget(productDto, Product.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if(product.getStockQuantity() < request.getQuantity())
        {
            return false;
        }
        CartItem existingItem = this.cartItemRepository.findByUsernameAndProductId(username,product.getId());
        if(existingItem != null)
        {
            //Update the quantity
            existingItem.setQuantity(existingItem.getQuantity()+request.getQuantity());
            existingItem.setPriceSnapshot(product.getPrice().multiply(BigDecimal.valueOf(existingItem.getQuantity())));
            cartItemRepository.saveAndFlush(existingItem);
        }else
        {
            //create a new cart item
            CartItem cartItem = new CartItem();
            cartItem.setUsername(username);
            cartItem.setProductId(product.getId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPriceSnapshot(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cartItemRepository.saveAndFlush(cartItem);
        }
        return true;
    }

    @Override
    @Transactional
    public CartItemDto updateQuantity(String productId, int quantity) {
        String username = this.getUsername();
        log.info("updateQuantity: username:{} productId={}, quantity={}", username, productId, quantity);

        if (quantity <= 0) {
            // CHANGED: quantity 0 ya negative ho to item remove kar do
            cartItemRepository.deleteByUsernameAndProductId(username, productId);
            return null;
        }

        CartItem cartItem = cartItemRepository.findByUsernameAndProductId(username, productId);
        if (cartItem == null) {
            return null;
        }

        // CHANGED: product ka latest price fetch karo taaki price stale na ho
        ResponseEntity<ProductDto> response = controller.find(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("ProductNotFoundException");
        }

        ProductDto productDto = response.getBody();
        Product product;
        try {
            product = MapperUtility.sourceToTarget(productDto, Product.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // Stock check
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        cartItem.setQuantity(quantity);
        cartItem.setPriceSnapshot(
                product.getPrice().multiply(BigDecimal.valueOf(quantity))
        );
        cartItem = cartItemRepository.saveAndFlush(cartItem);
        try {
            return MapperUtility.sourceToTarget(cartItem, CartItemDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public List<CartItemDto> getCart() {
        log.info("Inside @class CartServiceImpl @method getCart");
        String username = this.getUsername();
         return cartItemRepository.findByUsername(username).stream().map(item -> {
                        try {
                            log.info("Mapping CartItem to CartItemDto :");
                            return MapperUtility.sourceToTarget(item, CartItemDto.class);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
         }).toList();
    }

    @Override
    public void clearCart() {
        log.info("Inside @class CartServiceImpl @method clearCart ");
        String username = this.getUsername();
        cartItemRepository.deleteByUsername(username);
    }


    @Transactional
    @Override
    public boolean deleteItemFromCart( String productId) {
        log.info("Inside @class CartServiceImpl @method deleteItemFromCart ");
        String username = this.getUsername();
        if(!productId.isEmpty() && !username.isEmpty())
        {
            cartItemRepository.deleteByUsernameAndProductId(username, productId);
            return true;
        }
        return false;
    }

}