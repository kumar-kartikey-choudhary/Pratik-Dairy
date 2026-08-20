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

import java.math.BigDecimal;
import java.util.List;

@ResponseBody
@FeignClient(name = "PRATIK-DAIRY-PRODUCT", primary = false, path = "products", url = "${product.url}")
public interface ProductController {

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(path = "addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ProductDto> create(@RequestPart ProductDto productDto ,
                                      @RequestPart(value = "imageFile", required = false) MultipartFile imageFile);

    @GetMapping(path = "product/{id}")
    ResponseEntity<ProductDto> find(@PathVariable(name = "id") String id);

    @GetMapping(path = "all")
    ResponseEntity<List<ProductDto>> findAll();

    @GetMapping(path = "{productId}/image")
    ResponseEntity<byte[]> getImageByProductId(@PathVariable String productId);

    @GetMapping(path = "search")
    ResponseEntity<List<ProductDto>> searchProduct(@RequestParam String name);

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping(path = "admin/updateProduct/{id}")
    ResponseEntity<ProductDto> update( @PathVariable(name = "id") String id ,@RequestPart ProductDto productDto );

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping(path = "admin/updateProduct/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<ProductDto> update(@PathVariable(name = "id") String id ,@RequestPart ProductDto productDto ,  @RequestPart(value = "imageUrl", required = false) MultipartFile imageUrl);

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(path = "admin/deleteProduct/{id}")
    void delete(@PathVariable(name = "id") String id);

    // Internal, service-to-service only. Called by order-service at checkout time.
    // Deliberately NOT admin-only: a normal logged-in user placing an order must be able
    // to trigger this indirectly. Protected instead by requiring authentication + being
    // listed under an internal path prefix that is never exposed on the public gateway.
    //
    // `quantity` here is expressed in stockUnit-multiples, NOT the raw cart/order line
    // quantity — it is the weight-adjusted amount (see WeightPricing.stockToConsume()),
    // e.g. buying "250g" x2 off a "1kg" stockUnit consumes BigDecimal("0.5").
    @PreAuthorize("isAuthenticated()")
    @PatchMapping(path = "internal/{id}/decrement-stock")
    ResponseEntity<Boolean> decrementStock(@PathVariable(name = "id") String id, @RequestParam(name = "quantity") BigDecimal quantity);

    // Rolls back a decrement if a later item in the same order fails. Same units as decrementStock.
    @PreAuthorize("isAuthenticated()")
    @PatchMapping(path = "internal/{id}/restore-stock")
    ResponseEntity<Void> restoreStock(@PathVariable(name = "id") String id, @RequestParam(name = "quantity") BigDecimal quantity);

}