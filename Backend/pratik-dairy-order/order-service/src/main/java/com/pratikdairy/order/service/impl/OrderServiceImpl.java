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

import java.util.List;

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
        if(orderDto == null)
        {
            log.warn("Order object can not be null");
            throw new IllegalCallerException("Order object can not null");
        }
        try {

            Order order = MapperUtility.sourceToTarget(orderDto, Order.class);
            log.info("@Param order :{}",order);
            if (order.getItems() != null) {
                for (OrderItems item : order.getItems()) {
                    // Assign the parent Order object to the child item
                    item.setOrder(order);
                }
            }
            order = this.orderRepository.saveAndFlush(order);

            return MapperUtility.sourceToTarget(order, OrderDto.class);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<OrderDto> findAll() {
        return List.of();
    }

    @Override
    public List<OrderDto> findByCustomerName(String customerName) {
        return List.of();
    }

    @Override
    public OrderDto updateStatus(Long id, OrderStatus status) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
