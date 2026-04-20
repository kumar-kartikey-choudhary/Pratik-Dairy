package com.pratikdairy.order.controller;


import com.pratikdairy.order.dto.OrderResponse;
import com.pratikdairy.order.model.OrderStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ResponseBody
@FeignClient(name = "Order-Service" , primary = false)
public interface OrderController {

    String USER_ID_HEADER = "X-Auth-UserId";

    @PostMapping(path = "create")
    ResponseEntity<OrderResponse> create(
            @RequestHeader(USER_ID_HEADER) String userId);

    @GetMapping(path = "admin/findAll")
    ResponseEntity<List<OrderResponse>> findAll();



    @PutMapping(path = "admin/updateStatus/{id}")
    ResponseEntity<OrderResponse> updateStatus(
            @PathVariable("id") String id,
            @RequestParam("status") OrderStatus status
    );

    @DeleteMapping(path = "admin/delete/{id}")
    void delete(@PathVariable(name = "id") String id);
}
