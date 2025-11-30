package com.pratikdairy.order.controller;


import com.pratikdairy.order.dto.OrderDto;
import com.pratikdairy.order.model.OrderStatus;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ResponseBody
@FeignClient(name = "Order-Service" , primary = false)
public interface OrderController {

    @PostMapping(path = "create")
    ResponseEntity<OrderDto> create(@Valid @RequestBody OrderDto orderDto);

    @GetMapping(path = "admin/findAll")
    ResponseEntity<List<OrderDto>> findAll();

    @GetMapping(path = "/customer/{customerId}")
    ResponseEntity<List<OrderDto>> findByCustomerId(@PathVariable("customerId") Long customerId);

    @PutMapping(path = "admin/updateStatus/{id}")
    ResponseEntity<OrderDto> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") OrderStatus status
    );

    @DeleteMapping(path = "admin/delete/{id}")
    void delete(@PathVariable(name = "id") Long id);
}
