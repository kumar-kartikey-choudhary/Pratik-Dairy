package com.pratikdairy.cart.service.impl;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartDto;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.cart.entity.Cart;
import com.pratikdairy.cart.entity.CartItem;
import com.pratikdairy.cart.repository.CartItemRepository;
import com.pratikdairy.cart.repository.CartRepository;
import com.pratikdairy.cart.service.CartService;
import com.pratikdairy.product.controller.ProductController;
import com.pratikdairy.product.dto.ProductDto;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
public class CartServiceImpl implements CartService {

    // WARNING: This fixed ID breaks multi-user functionality. this will change when implement authentication
    private static final Long FIXED_CART_ID = 1L;

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductController controller;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductController controller)
    {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.controller = controller;
    }


    @Override
    @Transactional
    public CartDto addItemToCart(AddToCart request) {
        log.info("Inside @class CartServiceImpl @method addItemToCart Adding item {} to cart", request.getProductId());
        ResponseEntity<ProductDto> response = controller.find(request.getProductId());
        try {
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("ProductNotFoundException: Could not fetch product details.");
            }
            ProductDto productDto = response.getBody();
            Cart cart = getOrCreateFixedCart();

            Optional<CartItem> existingItem = this.cartItemRepository.findByCartIdAndProductId(FIXED_CART_ID, request.getProductId());

            CartItem cartItem = null;
            int netQuantity;
            if(existingItem.isPresent())
            {
                cartItem = existingItem.get();
                netQuantity = cartItem.getQuantity() + request.getQuantity();
            }else
            {
                createNewCartItem(cart, productDto);
                netQuantity = request.getQuantity();;
            }

            validateStock(productDto, netQuantity);
            assert cartItem != null;
            cartItem.setQuantity(netQuantity);
            this.cartItemRepository.saveAndFlush(cartItem);

            return buildCartDto();
        }catch (Exception e)
        {
            throw new RuntimeException("Error");
        }
    }

    @Override
    @Transactional
    public CartDto updateQuantity(Long productId, int quantity) {
        log.info("Inside @class CartServiceImpl @method updateQuantity ");

        if(quantity <= 0)
        {
            return this.removeItem(productId);
        }
        Cart cart = getOrCreateFixedCart();
        ResponseEntity<ProductDto> response = controller.find(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("ProductNotFoundException: Could not fetch product details.");
        }
        ProductDto productDto = response.getBody();

        CartItem cartItem = this.cartItemRepository.findByCartIdAndProductId(FIXED_CART_ID, productId).orElseThrow(() -> new RuntimeException("CartItemNotFoundException"));

        validateStock(productDto, quantity);

        cartItem.setQuantity(quantity);
        this.cartItemRepository.saveAndFlush(cartItem);

        return buildCartDto();
    }

    
    @Transactional
    private CartDto removeItem(Long productId) {
        log.info("Inside @class CartServiceImpl @method removeItem  ");
        Cart cart = getOrCreateFixedCart();
        ResponseEntity<ProductDto> response = controller.find(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("ProductNotFoundException: Could not fetch product details.");
        }
        ProductDto productDto = response.getBody();

        CartItem cartItem = this.cartItemRepository.findByCartIdAndProductId(FIXED_CART_ID, productId).orElseThrow(() -> new RuntimeException("CartItemNotFoundException"));

        this.cartItemRepository.delete(cartItem);
        return buildCartDto();
    }

    @Override
    public CartDto getCart() {
        return buildCartDto();
    }

    private Cart getOrCreateFixedCart() {
        return cartRepository.findById(FIXED_CART_ID)
                .orElseThrow(() -> new RuntimeException("Setup Error: Fixed Cart (ID 1) not found in DB."));
    }

    private CartItem createNewCartItem(Cart cart, ProductDto product) {
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductId(product.getId());
        item.setPriceSnapshot(product.getPrice());
        return item;
    }

    private void validateStock(ProductDto product, int requestedQuantity) {
        if (requestedQuantity > product.getStockQuantity()) {
            throw new RuntimeException("InsufficientStockException: Only " + product.getStockQuantity() + " units available.");
        }
    }

    private CartDto buildCartDto(){
        Cart cart = getOrCreateFixedCart();
        List<CartItem> items = cart.getItems();

        BigDecimal grandTotal = items.stream()
                .map(CartItem::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CartItemDto> itemDtos = items.stream().map(item -> {
            ProductDto productDto = controller.find(item.getProductId()).getBody();
            CartItemDto dto = new CartItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProductId());
            dto.setProductName(productDto.getProductName());
            dto.setPricePerUnit(item.getPriceSnapshot());
            dto.setQuantity(item.getQuantity());
            dto.setSubtotal(item.calculateSubtotal());

            return dto;
        }).toList();

        CartDto cartDto = new CartDto();
        cartDto.setItems(itemDtos);
        cartDto.setGrandTotal(grandTotal);

        return cartDto;
    }
}



