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
import com.pratikdairy.parent.utility.MapperUtility;
import com.pratikdairy.user.controller.UserController;
import com.pratikdairy.user.dto.UserDto;
import com.pratikdairy.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartController cartController;
    private final UserController userController;



    @Override
    public OrderResponse create(String userId) {
        log.info("Inside @class OrderServiceImpl @method create @Param userId :{}",userId);
        //validate for cart item
//        List<CartItemDto> cartItems = cartController.getCart(userId).getBody();

        List<CartItemDto> cartItems = cartController.getCart(userId).getBody();

        if(cartItems.isEmpty())
        {
           throw new NullPointerException("Cart item is empty");
        }

        //calculate total price
        BigDecimal totalPrice = cartItems.stream()
                .map(item -> item.getPricePerUnit().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        //create order
        Order order = new Order();
        order.setUserId(userId);
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
        cartController.clearCart(userId);

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
}
