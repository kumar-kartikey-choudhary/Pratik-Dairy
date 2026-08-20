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

    // Weight variant bought (e.g. "250g", "500g", "1kg") — copied from the cart line
    // at checkout time so order history can show exactly what the customer purchased,
    // even if the product's own stockUnit/price changes later.
    @Column(name = "WEIGHT", columnDefinition = "VARCHAR(20) DEFAULT '1kg'")
    private String weight = "1kg";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;
}