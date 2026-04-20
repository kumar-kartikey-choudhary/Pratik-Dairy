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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductController controller;
    private final UserController userController;

//    @Autowired
//    public CartServiceImpl( CartItemRepository cartItemRepository,
//                           ProductController controller, UserController userController)
//    {
//        this.cartItemRepository = cartItemRepository;
//        this.controller = controller;
//        this.userController = userController;
//    }


    @Override
    @Transactional
    public boolean addItemToCart(String userId, AddToCart request) {
        log.info("Inside @class CartServiceImpl @method addItemToCart Adding item {} to cart", request.getProductId());
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
//        UserDto userDto = userController.find(userId).getBody();
//        User user;
//        try {
//            user = MapperUtility.sourceToTarget(userDto, User.class);
//        }catch (Exception e)
//        {
//            throw new RuntimeException(e);
//        }
//        if(user == null)
//        {
//            return false;
//        }
        CartItem existingItem = this.cartItemRepository.findByUserIdAndProductId(userId,product.getId());
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
            cartItem.setUserId(userId);
            cartItem.setProductId(product.getId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPriceSnapshot(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cartItemRepository.saveAndFlush(cartItem);
        }
        return true;
    }

//    @Override
//    @Transactional
//    public CartDto updateQuantity(String userId,String productId, int quantity) {
//        log.info("Inside @class CartServiceImpl @method updateQuantity ");
//        if(quantity <= 0)
//        {
//            return this.removeItem(productId , userId);
//        }
//        Cart cart = getOrCreateFixedCart(userId);
//        ResponseEntity<ProductDto> response = controller.find(productId);
//        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
//            throw new RuntimeException("ProductNotFoundException: Could not fetch product details.");
//        }
//        ProductDto productDto = response.getBody();
//        CartItem cartItem = this.cartItemRepository.findByCartIdAndProductId(cart.getId(), productId).orElseThrow(() -> new RuntimeException("CartItemNotFoundException"));
//        validateStock(productDto, quantity);
//        cartItem.setQuantity(quantity);
//        this.cartItemRepository.saveAndFlush(cartItem);
//        return buildCartDto(cart);
//    }
//
//
    @Override
    public List<CartItemDto> getCart(String userId) {
        log.info("Inside @class CartServiceImpl @method getCart");
         return cartItemRepository.findByUserId(userId).stream().map(item -> {
                        try {
                            return MapperUtility.sourceToTarget(item, CartItemDto.class);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
         }).toList();
    }

    @Override
    public void clearCart(String userId) {
        log.info("Inside @class CartServiceImpl @method clearCart ");
        cartItemRepository.deleteByUserId(userId);
    }


    @Transactional
    @Override
    public boolean deleteItemFromCart(String userId, String productId) {
        log.info("Inside @class CartServiceImpl @method deleteItemFromCart ");
//        UserDto userDto = userController.find(userId).getBody();
//        ProductDto productDto = controller.find(productId).getBody();
//        User user;
//        Product product;
//        try {
//           user = MapperUtility.sourceToTarget(userDto, User.class);
//           product = MapperUtility.sourceToTarget(productDto, Product.class);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }

        if(!productId.isEmpty() && !userId.isEmpty())
        {
            cartItemRepository.deleteByUserIdAndProductId(userId, productId);
            return true;
        }
        return false;
    }

}