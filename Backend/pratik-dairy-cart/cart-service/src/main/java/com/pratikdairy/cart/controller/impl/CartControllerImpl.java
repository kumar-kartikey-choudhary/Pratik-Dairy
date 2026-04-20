package com.pratikdairy.cart.controller.impl;

import com.pratikdairy.cart.controller.CartController;
import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("carts")
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*")
@Primary
public class CartControllerImpl implements CartController {

    private final CartService cartService;


    @Autowired
    public CartControllerImpl(CartService cartService)
    {
        this.cartService = cartService;
    }


    @Override
    public ResponseEntity<String> addItemToCart(String userId,AddToCart request) {
        if(!cartService.addItemToCart(userId,request))
        {
            return ResponseEntity.badRequest().body("Product out of stock or User Not found Or Product not found");
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> removeFromCart(String userId, String productId) {
        boolean deleted = cartService.deleteItemFromCart(userId,productId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<List<CartItemDto>> getCart(String userId) {
        return ResponseEntity.ok(this.cartService.getCart(userId));
    }

    @Override
    public void clearCart(String userId) {
         cartService.clearCart(userId);
    }
}
