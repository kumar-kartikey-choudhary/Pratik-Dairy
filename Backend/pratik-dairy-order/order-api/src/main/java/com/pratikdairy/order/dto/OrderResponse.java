package com.pratikdairy.order.dto;

import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.parent.base.dto.BaseDto;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(callSuper = true)
@RequiredArgsConstructor
public class OrderResponse extends BaseDto {

    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDateTime = LocalDateTime.now();
    private List<OrderItemDto> items;

    public OrderResponse(String id, OrderStatus status, @NotNull BigDecimal totalAmount, List<OrderItemDto> orderItemDtoStream) {
    }
}
