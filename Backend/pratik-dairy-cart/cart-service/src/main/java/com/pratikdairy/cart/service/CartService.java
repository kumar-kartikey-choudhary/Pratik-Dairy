package com.pratikdairy.cart.service;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;

import java.util.List;

public interface CartService {


    boolean addItemToCart( AddToCart request);

    CartItemDto updateQuantity( String productId, int quantity);

    List<CartItemDto> getCart();

    void clearCart();

    boolean deleteItemFromCart(String productId);
}
