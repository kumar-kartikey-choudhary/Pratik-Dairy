package com.pratikdairy.order.controller;

import com.pratikdairy.order.dto.OrderItemDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@ResponseBody
@FeignClient(name = "ORDER-ITEM-SERVICE", primary = false)
public interface OrderItemController {

    /**
     * Creates a batch of OrderItems associated with a new Order ID.
     * This is typically called transactionally by the main Order service during checkout.
     * @param itemsList The list of items to create (contains product ID, quantity, price).
     * @return A list of the created OrderItem DTOs.
     */
    @PostMapping("/create-batch")
    ResponseEntity<List<OrderItemDto>> createOrderItems(@RequestBody List<OrderItemDto> itemsList);


    /**
     * Retrieves all items belonging to a specific Order ID.
     * Used internally by the Order service for DTO assembly (e.g., viewing order details).
     * @param orderId The ID of the parent order.
     * @return A list of OrderItem DTOs.
     */
    @GetMapping("/by-order/{orderId}")
    ResponseEntity<List<OrderItemDto>> getItemsByOrderId(@PathVariable("orderId") Long orderId);


    @GetMapping("/admin/all-items")
    ResponseEntity<List<OrderItemDto>> getAllOrderItems();

    /**
     * Deletes all items associated with a given Order ID (e.g., if an order is cancelled).
     * Requires Admin or Internal Service role.
     * @param orderId The ID of the parent order whose items need to be deleted.
     */
    @DeleteMapping("admin/delete-by-order/{orderId}")
    ResponseEntity<Void> deleteItemsByOrderId(@PathVariable("orderId") Long orderId);

}
