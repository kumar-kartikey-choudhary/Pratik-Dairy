package com.pratikdairy.cart.dto;

import lombok.Data;

@Data
public class AddToCart {

    private Long productId;
    private int quantity;
}
