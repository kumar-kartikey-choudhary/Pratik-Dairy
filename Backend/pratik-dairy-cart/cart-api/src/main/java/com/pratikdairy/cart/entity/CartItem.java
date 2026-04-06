package com.pratikdairy.cart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import java.math.BigDecimal;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {

    @Column(name = "PRODUCT_ID", nullable = false)
    private String productId;

    @Column(name = "QUANTITY" , nullable = false)
    private int quantity;

    @Column(name = "PRICE_SNAPSHOT" , nullable = false)
    private BigDecimal priceSnapshot;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "CART_ID", nullable = false)
    @JsonIgnore
    private Cart cart;


    public BigDecimal calculateSubtotal()
    {
        if(priceSnapshot == null) return  BigDecimal.ZERO;
        return priceSnapshot.multiply(BigDecimal.valueOf(quantity));
    }
}
