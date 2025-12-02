package com.pratikdairy.cart.controller.impl;

import com.pratikdairy.cart.controller.CartController;
import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartDto;
import com.pratikdairy.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping
@CrossOrigin("*")
public class CartControllerImpl implements CartController {

    private final CartService cartService;


    @Autowired
    public CartControllerImpl(CartService cartService)
    {
        this.cartService = cartService;
    }


    @Override
    public ResponseEntity<CartDto> addItemToCart(AddToCart request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.cartService.addItemToCart(request));
    }

    @Override
    public ResponseEntity<CartDto> updateQuantity(Long productId, int quantity) {
        return ResponseEntity.ok(this.cartService.updateQuantity(productId,quantity));
    }

    @Override
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(this.cartService.getCart());
    }
}
