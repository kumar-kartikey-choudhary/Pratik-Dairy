package com.pratikdairy.cart.entity;


import com.pratikdairy.parent.base.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Cart extends BaseEntity {

//    @Column(name = "CART_IDENTIFIER", unique = true, nullable = false, length = 100)
//    private String cartIdentifier;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items;

}
