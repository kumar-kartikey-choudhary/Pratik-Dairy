package com.pratikdairy.cart.dto;


import com.pratikdairy.parent.base.dto.BaseDto;
import com.pratikdairy.product.model.Product;
import com.pratikdairy.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class CartItemDto  extends BaseDto {

    private String username;
    private String productId;
    private int quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal subtotal;
}
