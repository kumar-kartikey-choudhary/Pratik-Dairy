package com.pratikdairy.order.model;

import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "ORDERS")
public class Order extends  BaseEntity{

    @NotNull
    @Column(name = "CUSTOMER_Name", nullable = false)
    private String customerName;

    @Column(name = "ORDER_TIME", nullable = false)
    private LocalTime orderTime = LocalTime.now();

    @Column(name = "ORDER_DATE", nullable = false)
    private LocalDate orderDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_STATUS" , nullable = false)
    private OrderStatus status = OrderStatus.NEW;

    @NotNull
    @Column(name = "SHIPPING_ADDRESS")
    private String shippingAddress;

    @NotNull
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "order",orphanRemoval = true)
    private List<OrderItems> items;

}
