package com.pratikdairy.cart.controller.impl;

import com.pratikdairy.cart.controller.CartController;
import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("carts")
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH},
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
    public ResponseEntity<String> addItemToCart(
            @RequestHeader(USER_NAME_HEADER) String username,
            @Valid @RequestBody AddToCart request) {
        if (!cartService.addItemToCart(username, request)) {
            return ResponseEntity.badRequest()
                    .body("Product out of stock or not found");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Item added to cart");
    }

    @Override
    public ResponseEntity<CartItemDto> updateQuantity(
            @RequestHeader(USER_NAME_HEADER) String username,
            @PathVariable String productId,
            @RequestParam int quantity) {
        CartItemDto updated = cartService.updateQuantity(username, productId, quantity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @Override
    public ResponseEntity<Void> removeFromCart(String username, String productId) {
        boolean deleted = cartService.deleteItemFromCart(username,productId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<List<CartItemDto>> getCart(String username) {
        return ResponseEntity.ok(this.cartService.getCart(username));
    }

    @Override
    public void clearCart(String username) {
         cartService.clearCart(username);
    }
}
