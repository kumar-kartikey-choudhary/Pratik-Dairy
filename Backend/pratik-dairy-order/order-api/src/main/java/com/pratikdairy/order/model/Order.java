package com.pratikdairy.order.model;

import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "ORDERS")
public class Order extends  BaseEntity{

    @NotNull
    @Column(name = "CUSTOMER_Name", nullable = false)
    private String customerId;

    @Column(name = "ORDER_TIME", nullable = false)
    private LocalDateTime orderDateTime = LocalDateTime.now();

    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_STATUS" , nullable = false)
    private OrderStatus status = OrderStatus.NEW;

    @NotNull
    @Column(name = "SHIPPING_ADDRESS")
    private String shippingAddress;

    @NotNull
    @Column(name = "TOTAL_AMOUNT")
    private BigDecimal totalAmount;

    @NotNull
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "order",orphanRemoval = true)
    private List<OrderItems> items  = new ArrayList<>();

}
