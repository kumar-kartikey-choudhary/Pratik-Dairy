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
    private String username;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDateTime = LocalDateTime.now();
    private List<OrderItemDto> items;

    // Used by create()/updateStatus() for the customer's own view — no explicit date needed there
    public OrderResponse(String id, String username, OrderStatus status,
                         @NotNull BigDecimal totalAmount, List<OrderItemDto> items) {
        this.setId(id);
        this.username = username;
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    // Used by findAll()/findByCustomerName() — carries the real order date, needed for admin table
    public OrderResponse(String id, String username, LocalDateTime orderDateTime, OrderStatus status,
                         @NotNull BigDecimal totalAmount, List<OrderItemDto> items) {
        this.setId(id);
        this.username = username;
        this.orderDateTime = orderDateTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
    }
}