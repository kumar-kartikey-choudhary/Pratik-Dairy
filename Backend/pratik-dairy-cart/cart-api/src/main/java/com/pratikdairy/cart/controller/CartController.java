package com.pratikdairy.cart.controller;


import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ResponseBody
@FeignClient(name = "PRATIK-DAIRY-CART")
public interface CartController {

    String USER_NAME_HEADER = "X-Auth-Username";

    @PostMapping(path = "items")
    ResponseEntity<String> addItemToCart(
            @RequestHeader(USER_NAME_HEADER) String username,
            @Valid @RequestBody AddToCart request
    );

    @PatchMapping(path = "items/{productId}")
    ResponseEntity<CartItemDto> updateQuantity(
            @RequestHeader(USER_NAME_HEADER) String username,
            @PathVariable String productId,
            @RequestParam int quantity
    );

    @GetMapping
    ResponseEntity<List<CartItemDto>> getCart(
           @RequestHeader(USER_NAME_HEADER) String username);

    @DeleteMapping(path = "items/{productId}")
    ResponseEntity<Void> removeFromCart(@RequestHeader(USER_NAME_HEADER) String username, @PathVariable String productId);

    void clearCart(@RequestHeader(USER_NAME_HEADER) String username);
}
