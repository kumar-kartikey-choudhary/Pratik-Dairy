package com.pratikdairy.cart.entity;

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
    private String productId;

    @Column(name = "USER_NAME", nullable = false)
    private String username;

    @Column(name = "QUANTITY", nullable = false)
    private int quantity;

    @Column(name = "WEIGHT", columnDefinition = "VARCHAR(20) DEFAULT '1kg'")
    private String weight = "1kg";

//    @Column(name = "PRICE_PER_UNIT", nullable = false)
//    private BigDecimal pricePerUnit;
//
//    public BigDecimal calculateSubtotal() {
//        if (pricePerUnit == null) return BigDecimal.ZERO;
//        return pricePerUnit.multiply(BigDecimal.valueOf(quantity));
//    }
}