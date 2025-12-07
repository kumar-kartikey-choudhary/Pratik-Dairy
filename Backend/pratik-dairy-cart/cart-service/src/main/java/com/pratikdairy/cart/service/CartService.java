package com.pratikdairy.cart.service;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartDto;

public interface CartService {


    CartDto addItemToCart(String userId,AddToCart request);

    CartDto updateQuantity(String userId,String productId, int quantity);

    CartDto getCart(String userId);
}
