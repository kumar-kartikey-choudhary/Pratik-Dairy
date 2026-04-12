package com.pratikdairy.order.dto;

import com.pratikdairy.order.model.OrderItems;
import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderDto extends BaseDto {

    private String customerId;
    private String userId;
    private BigDecimal totalAmount;
    private OrderStatus status = OrderStatus.NEW;
    private String shippingAddress;
    private LocalDateTime orderDateTime = LocalDateTime.now();
    private List<OrderItems> items;

}
