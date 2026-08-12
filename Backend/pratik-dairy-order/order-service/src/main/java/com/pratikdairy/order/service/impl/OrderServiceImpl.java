package com.pratikdairy.order.service.impl;

import com.pratikdairy.cart.controller.CartController;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.order.dto.OrderItemDto;
import com.pratikdairy.order.dto.OrderResponse;
import com.pratikdairy.order.model.Order;
import com.pratikdairy.order.model.OrderItems;
import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.order.repository.OrderRepository;
import com.pratikdairy.order.service.OrderService;
import com.pratikdairy.product.controller.ProductController;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartController cartController;
    private final ProductController productController;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, CartController cartController, ProductController productController) {
        this.orderRepository = orderRepository;
        this.cartController = cartController;
        this.productController = productController;
    }

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return auth.getName();
    }

    @Override
    @Transactional
    public OrderResponse create() {
        log.info("Inside @class OrderServiceImpl @method create");
        String username = getUsername();
        List<CartItemDto> cartItems = cartController.getCart().getBody();
        if(cartItems.isEmpty())
        {
            throw new NullPointerException("Cart item is empty");
        }

        // ---- CRITICAL: reserve stock BEFORE creating the order ----
        // Done atomically per item on the product-service side (UPDATE ... WHERE stock >= qty).
        // If ANY item fails, we roll back the ones we already decremented and abort the order.
        // This must happen here (server side, at checkout) — never on the frontend — otherwise
        // two simultaneous orders for the last unit of a product could both "succeed" and oversell.
        List<CartItemDto> decrementedSoFar = new ArrayList<>();
        for (CartItemDto item : cartItems) {
            ResponseEntity<Boolean> response = safeDecrementStock(item.getProductId(), item.getQuantity());
            boolean success = response.getBody() != null && response.getBody();
            if (!success) {
                // rollback whatever we already decremented in this loop
                for (CartItemDto done : decrementedSoFar) {
                    productController.restoreStock(done.getProductId(), done.getQuantity());
                }
                throw new RuntimeException("Insufficient stock for product: " + item.getProductId());
            }
            decrementedSoFar.add(item);
        }

        //calculate total price
        BigDecimal totalPrice = cartItems.stream()
                .map(item -> item.getPricePerUnit().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        //create order
        Order order = new Order();
        order.setUsername(username);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setTotalAmount(totalPrice);
        List<OrderItems> orderItems = cartItems.stream()
                .map(item -> new OrderItems(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPricePerUnit(),
                        order
                ))
                .toList();

        order.setItems(orderItems);
        Order order1 = orderRepository.saveAndFlush(order);
        //clear cart
        cartController.clearCart();

        return mapToOrderResponse(order1);
    }

    private OrderResponse mapToOrderResponse(Order order) {

        return  new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getItems()
                        .stream()
                        .map(item -> new OrderItemDto(
                                item.getId(),
                                item.getProductId(),
                                item.getQuantity(),
                                item.getPrice(),
                                item.getPrice().multiply(new BigDecimal(item.getQuantity()))
                        ))
                        .toList()
        );
    }

    @Override
    public List<OrderResponse> findAll() {
        return this.orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Override
    public OrderResponse updateStatus(String id, OrderStatus status) {
        try {
            Order order = this.orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
            order.setStatus(status);
            order = this.orderRepository.saveAndFlush(order);
            return mapToOrderResponse(order);
        }
        catch (Exception e)
        {
            throw new RuntimeException();
        }
    }

    @Override
    public void delete(String id) {
        this.orderRepository.deleteById(id);
    }


    @CircuitBreaker(name = "productService", fallbackMethod = "decrementStockFallback")
    public ResponseEntity<Boolean> safeDecrementStock(String productId, int qty) {
        return productController.decrementStock(productId, qty);
    }

    private ResponseEntity<Boolean> decrementStockFallback(String productId, int qty, Throwable t) {
        log.error("Product service unavailable, aborting checkout for {}: {}", productId, t.getMessage());
        return ResponseEntity.ok(false);
    }
}