package com.pratikdairy.cart.entity;

import com.pratikdairy.parent.base.entity.BaseEntity;
import com.pratikdairy.user.model.User;
import com.pratikdairy.product.model.Product;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {


    @Column(name = "PRODUCT_ID", nullable = false)
    private String productId;

    @Column(name = "USER_NAME", nullable = false)
    private String username;

    @Column(name = "QUANTITY" , nullable = false)
    private int quantity;

    @Column(name = "PRICE_SNAPSHOT" , nullable = false)
    private BigDecimal priceSnapshot;

    public BigDecimal calculateSubtotal()
    {
        if(priceSnapshot == null) return  BigDecimal.ZERO;
        return priceSnapshot.multiply(BigDecimal.valueOf(quantity));
    }
}
