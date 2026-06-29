package com.pratikdairy.product.controller;

import com.pratikdairy.product.dto.ProductDto;
import jakarta.validation.Valid;
import org.apache.http.Header;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@ResponseBody
@FeignClient(name = "PRATIK-DAIRY-PRODUCT", primary = false, path = "products")
public interface ProductController {

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ProductDto> create(
//            @RequestHeader("X-Auth-Role") String userRole,
            @RequestPart ProductDto productDto , @RequestPart(value = "imageFile", required = false) MultipartFile imageFile);



    @GetMapping(path = "product/{id}")
    ResponseEntity<ProductDto> find(@PathVariable(name = "id") String id);



    @GetMapping(path = "all")
    ResponseEntity<List<ProductDto>> findAll();

    @GetMapping(path = "{productId}/image")
    ResponseEntity<byte[]> getImageByProductId(@PathVariable String productId);



    @GetMapping(path = "search")
    ResponseEntity<List<ProductDto>> searchProduct(@RequestParam String name);


    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(path = "admin/updateProduct/{id}")
    ResponseEntity<ProductDto> update(
//            @RequestHeader("X-Auth-Role") String userRole,
            @PathVariable(name = "id") String id ,@RequestPart ProductDto productDto );



    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(path = "admin/updateProduct/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ProductDto> update(@PathVariable(name = "id") String id ,@RequestPart ProductDto productDto ,  @RequestPart(value = "imageUrl", required = false) MultipartFile imageUrl);




    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "admin/deleteProduct/{id}")
    void delete(@PathVariable(name = "id") String id);

}
