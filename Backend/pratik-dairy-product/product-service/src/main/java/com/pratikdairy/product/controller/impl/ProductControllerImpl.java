package com.pratikdairy.product.controller.impl;

import com.pratikdairy.product.controller.ProductController;
import com.pratikdairy.product.dto.ProductDto;
import com.pratikdairy.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*")
@Primary
@RequestMapping("products")
public class ProductControllerImpl implements ProductController {

    private final ProductService productService;

    @Autowired
    public ProductControllerImpl(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public ResponseEntity<ProductDto> create(ProductDto productDto, MultipartFile imageFile) {
        return new ResponseEntity<ProductDto>(this.productService.create(productDto, imageFile) , HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ProductDto> find(Long id) {
        return ResponseEntity.ok(this.productService.find(id));
    }

    @Override
    public ResponseEntity<List<ProductDto>> findAll() {
        return ResponseEntity.ok(this.productService.findAll());
    }

    @Override
    public ResponseEntity<byte[]> getImageByProductId(Long productId) {
        ProductDto productDto = this.productService.find(productId);
        byte[] imageData = productDto.getImageData();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(productDto.getImageType()))
                .body(imageData);
    }

    @Override
    public ResponseEntity<List<ProductDto>> searchProduct(String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(this.productService.searchProduct(name));
    }

    @Override
    public ResponseEntity<ProductDto> update(Long id, ProductDto productDto) {
        return ResponseEntity.ok(this.productService.update(productDto,id));
    }

    @Override
    public ResponseEntity<ProductDto> update( Long id,ProductDto productDto, MultipartFile imageFile) {
        return ResponseEntity.ok(this.productService.update(productDto,id,imageFile));
    }

    @Override
    public void delete(Long id) {
        this.productService.delete(id);
    }
}
