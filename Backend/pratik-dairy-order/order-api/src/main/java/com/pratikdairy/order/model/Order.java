package com.pratikdairy.order.model;

import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.pratikdairy.user.model.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "ORDER_HEADER")
@Data
@EqualsAndHashCode(callSuper = true)
public class Order extends  BaseEntity{


    @Column(name = "ORDER_TIME", nullable = false)
    private LocalDateTime orderDateTime = LocalDateTime.now();


    @Column(name = "USERNAME", nullable = false)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "ORDER_STATUS" , nullable = false)
    private OrderStatus status = OrderStatus.PROCESSING;


    @NotNull
    @Column(name = "TOTAL_AMOUNT")
    private BigDecimal totalAmount;

    @NotNull
    @OneToMany(cascade = CascadeType.ALL , mappedBy = "order",orphanRemoval = true)
    private List<OrderItems> items  = new ArrayList<>();

}
