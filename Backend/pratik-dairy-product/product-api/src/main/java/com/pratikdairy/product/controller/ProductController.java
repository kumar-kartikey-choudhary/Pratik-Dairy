package com.pratikdairy.product.controller;

import com.pratikdairy.product.dto.ProductDto;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@ResponseBody
@FeignClient(name = "Product-Service", primary = false)
public interface ProductController {

    @PostMapping(path = "admin/addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ProductDto> create(@RequestPart ProductDto productDto , @RequestPart(value = "imageFile", required = false) MultipartFile imageFile);

    @GetMapping(path = "product/{id}")
    ResponseEntity<ProductDto> find(@PathVariable(name = "id") Long id);

    @GetMapping(path = "products")
    ResponseEntity<List<ProductDto>> findAll();

    @GetMapping(path = "{productId}/image")
    ResponseEntity<byte[]> getImageByProductId(@PathVariable Long productId);

    @GetMapping(path = "search")
    ResponseEntity<List<ProductDto>> searchProduct(@RequestParam String name);

    ResponseEntity<ProductDto> update(Long id, ProductDto productDto);

    @PutMapping(path = "admin/updateProduct/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ProductDto> update(@PathVariable(name = "id") Long id ,@RequestPart ProductDto productDto ,  @RequestPart(value = "imageUrl", required = false) MultipartFile imageUrl);

    @DeleteMapping(path = "admin/deleteProduct/{id}")
    void delete(@PathVariable(name = "id") Long id);


}
