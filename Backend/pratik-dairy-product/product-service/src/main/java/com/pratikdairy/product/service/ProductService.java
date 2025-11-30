package com.pratikdairy.product.service;

import com.pratikdairy.product.dto.ProductDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductDto create(ProductDto productDto, MultipartFile imageFile);

    ProductDto find(Long id);

    List<ProductDto> findAll();

    ProductDto update(ProductDto productDto, Long id);


    ProductDto update(ProductDto productDto, Long id, MultipartFile imageFile);

    void delete(Long id);

    List<ProductDto> searchProduct(String name);
}
