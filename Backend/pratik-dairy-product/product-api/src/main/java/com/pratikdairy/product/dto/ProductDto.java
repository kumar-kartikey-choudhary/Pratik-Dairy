package com.pratikdairy.product.dto;

import com.pratikdairy.parent.base.dto.BaseDto;
import com.pratikdairy.product.enums.Category;
import com.pratikdairy.product.enums.SweetType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)
public class ProductDto extends BaseDto {

    private String productName;
    private BigDecimal price;
    private boolean available;
    private int stockQuantity;
    private String stockUnit;
    private Category category;
    private SweetType type;
    private String description;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private String imageName;
    private String imageType;
    private byte[] imageData;
    private String status;
}
