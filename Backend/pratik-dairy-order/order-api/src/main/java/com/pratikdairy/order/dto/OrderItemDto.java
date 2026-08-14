package com.pratikdairy.order.dto;

import com.pratikdairy.parent.base.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderItemDto extends BaseDto {
    private String productId;
    private String productName;   // only populated for findAll()/findByCustomerName()
    private byte[] imageData;     // only populated for findAll()/findByCustomerName()
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subTotal;

    // Lightweight — used by create()/updateStatus(), no product-service call needed
    public OrderItemDto(String id, String productId, Integer quantity, BigDecimal price, BigDecimal subTotal) {
        this.setId(id);
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.subTotal = subTotal;
    }

    // Enriched — used by findAll()/findByCustomerName(), includes product name/image for display
    public OrderItemDto(String id, String productId, String productName, byte[] imageData,
                        Integer quantity, BigDecimal price, BigDecimal subTotal) {
        this.setId(id);
        this.productId = productId;
        this.productName = productName;
        this.imageData = imageData;
        this.quantity = quantity;
        this.price = price;
        this.subTotal = subTotal;
    }
}