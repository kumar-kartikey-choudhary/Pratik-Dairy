package com.pratikdairy.order.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderItems extends BaseEntity {

    @Column(name = "PRODUCT_ID" , nullable = false)
    private String productId;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "PRICE_AT_PURCHASE")
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;
}
