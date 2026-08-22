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
import com.pratikdairy.cart.util.WeightPricing;
import com.pratikdairy.product.controller.ProductController;
import com.pratikdairy.product.dto.ProductDto;
import jakarta.transaction.Transactional;
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

    private ProductDto fetchProduct(String productId) {
        ResponseEntity<ProductDto> response = productController.find(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Could not fetch product details for id " + productId);
        }
        return response.getBody();
    }

    // ---------- NEW RECORD: We now trust the price directly from the CartItemDto ----------
    private record PricedLine(CartItemDto cartItem, BigDecimal pricePerUnit, BigDecimal stockToConsume) {}

    private PricedLine priceLine(CartItemDto item) {
        ProductDto product = fetchProduct(item.getProductId());

        // CRITICAL FIX: DO NOT recalculate the price here.
        // Use the exact pricePerUnit that the Cart Service already calculated for this weight variant.
        BigDecimal pricePerUnit = item.getPricePerUnit();

        // Stock consumption still needs to be calculated based on the weight variant
        BigDecimal stockToConsume = WeightPricing.stockToConsume(item.getWeight(), product.getStockUnit(), item.getQuantity());

        return new PricedLine(item, pricePerUnit, stockToConsume);
    }

    @Override
    @Transactional
    public OrderResponse create() {
        log.info("Inside @class OrderServiceImpl @method create");
        String username = getUsername();
        List<CartItemDto> cartItems = cartController.getCart().getBody();

        if (cartItems == null || cartItems.isEmpty()) {
            throw new NullPointerException("Cart item is empty");
        }

        List<PricedLine> lines = cartItems.stream().map(this::priceLine).toList();

        List<PricedLine> decrementedSoFar = new ArrayList<>();
        for (PricedLine line : lines) {
            ResponseEntity<Boolean> response = safeDecrementStock(line.cartItem().getProductId(), line.stockToConsume());
            boolean success = response.getBody() != null && response.getBody();
            if (!success) {
                // rollback
                for (PricedLine done : decrementedSoFar) {
                    productController.restoreStock(done.cartItem().getProductId(), done.stockToConsume());
                }
                throw new RuntimeException("Insufficient stock for product: " + line.cartItem().getProductId());
            }
            decrementedSoFar.add(line);
        }

        // Calculate total amount based on the correct unit prices from the cart
        BigDecimal totalPrice = lines.stream()
                .map(line -> line.pricePerUnit().multiply(BigDecimal.valueOf(line.cartItem().getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // create order
        Order order = new Order();
        order.setUsername(username);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setTotalAmount(totalPrice);

        List<OrderItems> orderItems = lines.stream()
                .map(line -> new OrderItems(
                        line.cartItem().getProductId(),
                        line.cartItem().getQuantity(),
                        line.pricePerUnit(), // Saved precisely as it was in the cart
                        line.cartItem().getWeight(),
                        order
                ))
                .toList();

        order.setItems(orderItems);
        Order savedOrder = orderRepository.saveAndFlush(order);

        // clear cart
        cartController.clearCart();

        return mapToOrderResponse(savedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemDto> itemDtos = order.getItems()
                .stream()
                .map(item -> new OrderItemDto(
                        item.getId(),
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())),
                        item.getWeight()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUsername(),
                order.getOrderDateTime(),
                order.getStatus(),
                order.getTotalAmount(),
                itemDtos
        );
    }

    private OrderResponse mapToOrderResponseWithProductDetails(Order order) {
        List<OrderItemDto> itemDtos = order.getItems()
                .stream()
                .map(this::mapToOrderItemDtoWithProductDetails)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUsername(),
                order.getOrderDateTime(),
                order.getStatus(),
                order.getTotalAmount(),
                itemDtos
        );
    }

    private OrderItemDto mapToOrderItemDtoWithProductDetails(OrderItems item) {
        ProductDto product = fetchProduct(item.getProductId());

        return new OrderItemDto(
                item.getId(),
                item.getProductId(),
                product.getProductName(),
                product.getImageData(),
                item.getQuantity(),
                item.getPrice(),
                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())),
                item.getWeight()
        );
    }

    @Override
    public List<OrderResponse> findAll() {
        return this.orderRepository.findAll().stream()
                .map(this::mapToOrderResponseWithProductDetails)
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
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    @Override
    public void delete(String id) {
        this.orderRepository.deleteById(id);
    }

    @Transactional
    @Override
    public List<OrderResponse> findByCustomerName() {
        log.info("Inside @OrderServiceImpl class @findByCustomerName method");
        String username = this.getUsername();
        List<Order> orders = this.orderRepository.findByUsername(username);
        return orders.stream()
                .map(this::mapToOrderResponseWithProductDetails)
                .toList();
    }

    @CircuitBreaker(name = "productService", fallbackMethod = "decrementStockFallback")
    public ResponseEntity<Boolean> safeDecrementStock(String productId, BigDecimal qty) {
        return productController.decrementStock(productId, qty);
    }

    private ResponseEntity<Boolean> decrementStockFallback(String productId, BigDecimal qty, Throwable t) {
        log.error("Product service unavailable, aborting checkout for {}: {}", productId, t.getMessage());
        return ResponseEntity.ok(false);
    }
}