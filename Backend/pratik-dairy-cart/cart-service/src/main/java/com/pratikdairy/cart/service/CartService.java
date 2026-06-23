package com.pratikdairy.cart.service;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import jdk.dynalink.linker.LinkerServices;

import java.util.List;

public interface CartService {


    boolean addItemToCart(String username, AddToCart request);

    CartItemDto updateQuantity(String username, String productId, int quantity);

    List<CartItemDto> getCart(String username);

    void clearCart(String userId);

    boolean deleteItemFromCart(String username, String productId);
}
