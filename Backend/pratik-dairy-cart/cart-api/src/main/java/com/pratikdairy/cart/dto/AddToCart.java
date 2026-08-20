package com.pratikdairy.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddToCart {
    @NotBlank(message = "Product Id is required")
    private String productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    private String weight;
    private Double totalAmount;
}
