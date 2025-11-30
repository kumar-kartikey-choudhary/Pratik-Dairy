package com.pratikdairy.order.dto;

import com.pratikdairy.order.model.Order;
import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderItemDto extends BaseDto {

    private Long productId;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private Order order;
}
