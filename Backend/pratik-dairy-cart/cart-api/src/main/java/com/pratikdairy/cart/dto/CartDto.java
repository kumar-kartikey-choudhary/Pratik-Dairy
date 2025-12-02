package com.pratikdairy.cart.dto;


import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class CartDto extends BaseDto {

    private String cartIdentifier;
    private List<CartItemDto> items;
    private BigDecimal grandTotal;
}
