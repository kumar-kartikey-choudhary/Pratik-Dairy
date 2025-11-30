package com.pratikdairy.order.dto;

import com.pratikdairy.order.model.OrderItems;
import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderDto extends BaseDto {

    private Long customerId;
    private LocalTime orderTime = LocalTime.now();
    private LocalDate orderDate = LocalDate.now();
    private OrderStatus status = OrderStatus.NEW;
    private String shippingAddress;
    private List<OrderItems> items;

}
