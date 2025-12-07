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

    String USER_ID_HEADER = "X-Auth-UserId";

    @PostMapping(path = "items")
    ResponseEntity<CartDto> addItemToCart(
            @RequestHeader(USER_ID_HEADER) String userId,
            @Valid @RequestBody AddToCart request
    );

    @PutMapping(path = "items/{productId}")
    ResponseEntity<CartDto> updateQuantity(
            @RequestHeader(USER_ID_HEADER) String userId,
            @PathVariable String productId,
            @RequestParam int quantity
    );

    @GetMapping
    ResponseEntity<CartDto> getCart(
           @RequestHeader(USER_ID_HEADER) String userId);
}
