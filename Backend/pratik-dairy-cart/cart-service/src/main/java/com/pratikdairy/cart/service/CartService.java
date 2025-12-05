package com.pratikdairy.cart.service;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartDto;

public interface CartService {


    CartDto addItemToCart(Long userId,AddToCart request);

    CartDto updateQuantity(Long userId,Long productId, int quantity);

    CartDto getCart(Long userId);
}
