package com.pratikdairy.cart.controller;


import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartDto;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ResponseBody
@FeignClient(name = "PRATIK-DAIRY-CART")
public interface CartController {

    @PostMapping(path = "items")
    ResponseEntity<CartDto> addItemToCart(
//            @RequestHeader(CART_ID_HEADER) String cartIdentifier, // Session ID/Unique Cart ID
            @Valid @RequestBody AddToCart request
    );

    @PutMapping(path = "items/{productId}")
    ResponseEntity<CartDto> updateQuantity(
//            @RequestHeader(CART_ID_HEADER) String cartIdentifier,
            @PathVariable Long productId,
            @RequestParam int quantity
    );

    @GetMapping
    ResponseEntity<CartDto> getCart(
//            @RequestHeader(CART_ID_HEADER) String cartIdentifier
    );
}
