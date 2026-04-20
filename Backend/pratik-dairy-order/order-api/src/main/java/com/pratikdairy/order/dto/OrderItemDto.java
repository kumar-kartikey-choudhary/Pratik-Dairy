package com.pratikdairy.order.dto;

import com.pratikdairy.order.model.Order;
import com.pratikdairy.parent.base.dto.BaseDto;
import com.pratikdairy.product.model.Product;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderItemDto extends BaseDto {

    private String productId;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subTotal;

    public OrderItemDto(String id, String productId, Integer quantity, BigDecimal price, BigDecimal multiply) {
    }
}
