package com.pratikdairy.cart.service;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartDto;

public interface CartService {


    CartDto addItemToCart(AddToCart request);

    CartDto updateQuantity(Long productId, int quantity);

    CartDto getCart();
}
