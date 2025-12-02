package com.pratikdairy.cart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {

    @Column(name = "PRODUCT_ID", nullable = false)
    private Long productId;

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
        return priceSnapshot.multiply(BigDecimal.valueOf(quantity));
    }
}
