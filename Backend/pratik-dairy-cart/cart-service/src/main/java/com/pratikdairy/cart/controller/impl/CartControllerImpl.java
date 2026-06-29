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
            @Valid @RequestBody AddToCart request) {
        if (!cartService.addItemToCart(request)) {
            return ResponseEntity.badRequest()
                    .body("Product out of stock or not found");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Item added to cart");
    }

    @Override
    public ResponseEntity<CartItemDto> updateQuantity(
            @PathVariable String productId,
            @RequestParam int quantity) {
        CartItemDto updated = cartService.updateQuantity(productId, quantity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @Override
    public ResponseEntity<Void> removeFromCart(String productId) {
        boolean deleted = cartService.deleteItemFromCart(productId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<List<CartItemDto>> getCart() {
        return ResponseEntity.ok(this.cartService.getCart());
    }

    @Override
    public void clearCart() {
         cartService.clearCart();
    }
}
