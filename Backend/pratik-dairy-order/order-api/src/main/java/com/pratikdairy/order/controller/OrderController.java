package com.pratikdairy.order.controller;


import com.pratikdairy.order.dto.OrderItemDto;
import com.pratikdairy.order.dto.OrderResponse;
import com.pratikdairy.order.model.Order;
import com.pratikdairy.order.model.OrderStatus;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ResponseBody
@FeignClient(name = "PRATIK-DAIRY-CART", path = "orders", primary = false)
public interface OrderController {


    @PostMapping(path = "create")
    ResponseEntity<OrderResponse> create();

    @GetMapping(path = "/findByCustomer")
    ResponseEntity<List<OrderResponse>> findByCustomerName();

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(path = "admin/findAll")
    ResponseEntity<List<OrderResponse>> findAll();


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(path = "admin/updateStatus/{id}")
    ResponseEntity<OrderResponse> updateStatus(
            @PathVariable("id") String id,
            @RequestParam("status") OrderStatus status
    );

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(path = "admin/delete/{id}")
    void delete(@PathVariable(name = "id") String id);
}
