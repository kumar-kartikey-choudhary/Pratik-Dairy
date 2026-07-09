package com.pratikdairy.order.controller.impl;

import com.pratikdairy.order.controller.OrderController;
import com.pratikdairy.order.dto.OrderResponse;
import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.order.service.OrderService;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("orders")
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*")
@Primary
public class OrderControllerImpl implements OrderController {

    private final OrderService orderService;

    public OrderControllerImpl(OrderService orderService)
    {
        this.orderService = orderService;
    }


    @Override
    public ResponseEntity<OrderResponse> create() {
        return new ResponseEntity<>(this.orderService.create(), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<OrderResponse>> findAll() {
        return ResponseEntity.ok(this.orderService.findAll());
    }


    @Override
    public ResponseEntity<OrderResponse> updateStatus(String id, OrderStatus status) {
        return ResponseEntity.ok(this.orderService.updateStatus(id,status));
    }

    @Override
    public void delete(String id) {
        this.orderService.delete(id);
    }
}
