package com.pratikdairy.cart.service;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import jdk.dynalink.linker.LinkerServices;

import java.util.List;

public interface CartService {


    boolean addItemToCart(String userId, AddToCart request);

    List<CartItemDto> getCart(String userId);

    void clearCart(String userId);

    boolean deleteItemFromCart(String userId, String productId);
}
