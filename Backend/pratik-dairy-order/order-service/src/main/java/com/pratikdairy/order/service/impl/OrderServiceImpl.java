package com.pratikdairy.order.service.impl;

import com.pratikdairy.order.dto.OrderDto;
import com.pratikdairy.order.model.Order;
import com.pratikdairy.order.model.OrderItems;
import com.pratikdairy.order.model.OrderStatus;
import com.pratikdairy.order.repository.OrderRepository;
import com.pratikdairy.order.service.OrderService;
import com.pratikdairy.parent.utility.MapperUtility;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository)
    {
        this.orderRepository = orderRepository;
    }

    @Override
    public OrderDto create(OrderDto orderDto) {
        log.info("Inside @class OrderServiceImpl @method create @Param orderDto :{}",orderDto);
        if(orderDto == null || orderDto.getItems() == null || orderDto.getItems().isEmpty())
        {
            log.warn("Order object can not be null");
            throw new IllegalCallerException("Order object can not null");
        }
        try {
            Order order = MapperUtility.sourceToTarget(orderDto, Order.class);
            log.info("@Param order :{}",order);
            BigDecimal calculateddTotal = BigDecimal.ZERO;
            if (order.getItems() != null) {
                for (OrderItems item : order.getItems()) {
                    // Assign the parent Order object to the child item
                    item.setOrder(order);
                    BigDecimal itemSubTotal = item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity()));
                    calculateddTotal = calculateddTotal.add(itemSubTotal);
                }
            }
            order.setTotalAmount(calculateddTotal);
            order = this.orderRepository.saveAndFlush(order);

            return MapperUtility.sourceToTarget(order, OrderDto.class);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<OrderDto> findAll() {
        return this.orderRepository.findAll().stream()
                .map(order -> {
                    try {
                        return MapperUtility.sourceToTarget(order, OrderDto.class);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto updateStatus(String id, OrderStatus status) {
      try {
          Order order = this.orderRepository.findById(id)
                  .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
          order.setStatus(status);
          order = this.orderRepository.saveAndFlush(order);
          return MapperUtility.sourceToTarget(order, OrderDto.class);
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

    @Override
    public List<OrderDto> findByCustomerId(String customerId) {
        return this.orderRepository.findByCustomerId(customerId).stream()
                .map(order -> {
                    try {
                        return MapperUtility.sourceToTarget(order, OrderDto.class);
                    } catch (NoSuchMethodException e) {
                        throw new RuntimeException(e);
                    } catch (InvocationTargetException e) {
                        throw new RuntimeException(e);
                    } catch (InstantiationException e) {
                        throw new RuntimeException(e);
                    } catch (IllegalAccessException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }
}
