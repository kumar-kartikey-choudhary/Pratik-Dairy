package com.pratikdairy.order.dto;

import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.parent.base.dto.BaseDto;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderResponse extends BaseDto {
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDateTime = LocalDateTime.now();
    private List<OrderItemDto> items;

    // Used by create()/updateStatus() — no explicit date, defaults to now (fine for create;
    // for updateStatus you'll want the other constructor so the ORIGINAL order date is preserved)
    public OrderResponse(String id, OrderStatus status, @NotNull BigDecimal totalAmount, List<OrderItemDto> items) {
        this.setId(id);
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    // Used by findAll()/findByCustomerName()/updateStatus() — carries the real order date
    public OrderResponse(String id, LocalDateTime orderDateTime, OrderStatus status,
                         @NotNull BigDecimal totalAmount, List<OrderItemDto> items) {
        this.setId(id);
        this.orderDateTime = orderDateTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
    }
}