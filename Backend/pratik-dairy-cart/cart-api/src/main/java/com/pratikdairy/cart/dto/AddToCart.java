package com.pratikdairy.cart.dto;

import lombok.Data;

@Data
public class AddToCart {

    private String productId;
    private int quantity;
}
