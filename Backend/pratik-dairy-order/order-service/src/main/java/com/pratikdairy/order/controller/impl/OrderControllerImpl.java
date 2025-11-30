package com.pratikdairy.order.controller.impl;

import com.pratikdairy.order.controller.OrderController;
import com.pratikdairy.order.dto.OrderDto;
import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.order.service.OrderService;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
@Primary
public class OrderControllerImpl implements OrderController {

    private final OrderService orderService;

    public OrderControllerImpl(OrderService orderService)
    {
        this.orderService = orderService;
    }


    @Override
    public ResponseEntity<OrderDto> create(OrderDto orderDto) {
        return new ResponseEntity<>(this.orderService.create(orderDto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<OrderDto>> findAll() {
        return ResponseEntity.ok(this.orderService.findAll());
    }

    @Override
    public ResponseEntity<List<OrderDto>> findByCustomerId(Long customerId) {
        return ResponseEntity.ok(this.orderService.findByCustomerId(customerId));
    }

    @Override
    public ResponseEntity<OrderDto> updateStatus(Long id, OrderStatus status) {
        return ResponseEntity.ok(this.orderService.updateStatus(id,status));
    }

    @Override
    public void delete(Long id) {
        this.orderService.delete(id);
    }
}
