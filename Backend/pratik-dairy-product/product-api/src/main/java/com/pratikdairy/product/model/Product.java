package com.pratikdairy.product.model;

import com.pratikdairy.parent.base.entity.BaseEntity;
import com.pratikdairy.product.enums.Category;
import com.pratikdairy.product.enums.SweetType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
public class Product extends BaseEntity {

    @Column(name = "PRODUCT_NAME" , columnDefinition = "VARCHAR(100) NOT NULL ", nullable = false)
    private String productName;

    @Column(name = "PRICE", nullable = false)
    private BigDecimal price;

    @Column(name = "IS_AVAILABLE" , columnDefinition = "TINYINT(1) DEFAULT '0'")
    private boolean available = true;

    @Column(name = "STOCK_UNIT" , columnDefinition = "VARCHAR(1000) NOT NULL ", nullable = false)
    private String stockUnit;

    // CRITICAL: Tracks current inventory level
    @Column(name = "STOCK_QUANTITY", columnDefinition = "INT DEFAULT '0'")
    private int stockQuantity = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORY", columnDefinition = "VARCHAR(20) NOT NULL", nullable = false)
    private Category category;


    @Enumerated(EnumType.STRING)
    @Column(name = "SWEET_TYPE" , columnDefinition = "VARCHAR(50)")
    private SweetType type;

    @Column(name = "DESCRIPTION", columnDefinition = "VARCHAR(1000)")
    private String description;


    @Column(name = "IMAGE_NAME")
    private String imageName;

    @Column(name = "IMAGE_TYPE")
    private String imageType;

    @Lob
    @Column(name = "IMAGE_DATA",columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(name = "MANUFACTURE_DATE")
    private LocalDate manufactureDate;

    @Column(name = "EXPIRY_DATE")
    private LocalDate expiryDate;

    @Column(name = "STATUS")
    private String status;
}
