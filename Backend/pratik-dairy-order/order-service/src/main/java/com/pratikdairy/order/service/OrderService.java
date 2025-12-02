package com.pratikdairy.order.service;

import com.pratikdairy.order.dto.OrderDto;
import com.pratikdairy.order.model.OrderStatus;

import java.util.List;

public interface OrderService {
    
    OrderDto create(OrderDto orderDto);

    List<OrderDto> findAll();

    List<OrderDto> findByCustomerName(String customerName);

    OrderDto updateStatus(Long id, OrderStatus status);

    void delete(Long id);
}
