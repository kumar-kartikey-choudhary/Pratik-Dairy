package com.pratikdairy.order.service;

import com.pratikdairy.order.dto.OrderResponse;
import com.pratikdairy.order.model.OrderStatus;

import java.util.List;

public interface OrderService {
    
    OrderResponse create();

    List<OrderResponse> findAll();

    OrderResponse updateStatus(String id, OrderStatus status);

    void delete(String id);

}
