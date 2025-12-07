package com.pratikdairy.cart.dto;


import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class CartItemDto  extends BaseDto {

    private String productId;
    private String productName;
    private int quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal subtotal;
}
