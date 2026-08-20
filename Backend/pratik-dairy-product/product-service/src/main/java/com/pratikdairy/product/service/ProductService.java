package com.pratikdairy.product.service;

import com.pratikdairy.product.dto.ProductDto;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    ProductDto create(ProductDto productDto, MultipartFile imageFile);

    ProductDto find(String id);

    List<ProductDto> findAll();

    ProductDto update(ProductDto productDto, String id);


    ProductDto update(ProductDto productDto, String id, MultipartFile imageFile);

    void delete(String id);

    List<ProductDto> searchProduct(String name);

    // Returns true if stock was successfully decremented (enough stock was available), false otherwise.
    // quantity is in stockUnit-multiples (weight-adjusted) — see WeightPricing.stockToConsume().
    boolean decrementStock(String id, BigDecimal quantity);

    // Adds stock back — used to roll back a decrement when an order fails partway through.
    void restoreStock(String id, BigDecimal quantity);
}