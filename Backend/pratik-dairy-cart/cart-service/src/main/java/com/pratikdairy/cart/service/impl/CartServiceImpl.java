package com.pratikdairy.cart.service.impl;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.cart.entity.CartItem;
import com.pratikdairy.cart.repository.CartItemRepository;
import com.pratikdairy.cart.service.CartService;
import com.pratikdairy.cart.util.WeightPricing;
import com.pratikdairy.product.controller.ProductController;
import com.pratikdairy.product.dto.ProductDto;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductController controller;

    @Autowired
    public CartServiceImpl(CartItemRepository cartItemRepository,
                           ProductController controller) {
        this.cartItemRepository = cartItemRepository;
        this.controller = controller;
    }

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return auth.getName();
    }

    private ProductDto fetchProduct(String productId) {
        ResponseEntity<ProductDto> response = controller.find(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("ProductNotFoundException: Could not fetch product details for id " + productId);
        }
        return response.getBody();
    }

    @Override
    @Transactional
    public CartItemDto addItemToCart(AddToCart request) {
        log.info("Adding product {} to cart", request.getProductId());
        String username = this.getUsername();
        ProductDto productDto = fetchProduct(request.getProductId());

        String defaultWeight = (productDto.getStockUnit() != null && !productDto.getStockUnit().isBlank())
                ? productDto.getStockUnit().trim().toLowerCase()
                : "1kg";
        String weight = (request.getWeight() == null || request.getWeight().isBlank())
                ? defaultWeight
                : request.getWeight().trim().toLowerCase();

        CartItem existingItem = cartItemRepository.findByUsernameAndProductIdAndWeight(username, productDto.getId(), weight);
        int qtyToAdd = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;
        int newLineQuantity = qtyToAdd + (existingItem != null ? existingItem.getQuantity() : 0);

        BigDecimal stockNeeded = WeightPricing.stockToConsume(weight, productDto.getStockUnit(), newLineQuantity);
        if (productDto.getStockQuantity() == null || productDto.getStockQuantity().compareTo(stockNeeded) < 0) {
            return null;
        }

        CartItem savedItem;
        if (existingItem != null) {
            existingItem.setQuantity(newLineQuantity);
            savedItem = cartItemRepository.saveAndFlush(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUsername(username);
            cartItem.setProductId(productDto.getId());
            cartItem.setCreatedBy(username);
            cartItem.setCreatedAt(ZonedDateTime.now());
            cartItem.setQuantity(qtyToAdd);
            cartItem.setWeight(weight);
            savedItem = cartItemRepository.saveAndFlush(cartItem);
        }

        return toDto(savedItem, productDto);
    }

    @Override
    @Transactional
    public CartItemDto updateQuantity(String productId, int quantity) {
        String username = this.getUsername();

        if (quantity <= 0) {
            cartItemRepository.deleteByUsernameAndProductId(username, productId);
            return null;
        }

        CartItem cartItem = cartItemRepository.findByUsernameAndProductId(username, productId);
        if (cartItem == null) {
            return null;
        }

        ProductDto productDto = fetchProduct(productId);
        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.saveAndFlush(cartItem);

        return toDto(cartItem, productDto);
    }

    @Transactional
    @Override
    public List<CartItemDto> getCart() {
        String username = this.getUsername();
        return cartItemRepository.findByUsername(username).stream()
                .map(item -> {
                    ProductDto productDto = fetchProduct(item.getProductId());
                    return toDto(item, productDto);
                })
                .toList();
    }

    private CartItemDto toDto(CartItem item, ProductDto productDto) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setUsername(item.getUsername());
        dto.setProductId(item.getProductId());
        dto.setQuantity(item.getQuantity());
        dto.setProductName(productDto.getProductName());
        dto.setProductImageUrl(productDto.getImageData());
        dto.setUnit(productDto.getStockUnit());
        dto.setWeight(item.getWeight());

        // Price per unit based on selected weight vs base unit
        BigDecimal pricePerUnit = WeightPricing.priceFor(productDto.getPrice(), item.getWeight(), productDto.getStockUnit());
        dto.setPricePerUnit(pricePerUnit);

        // Subtotal = Unit Price * Quantity
        BigDecimal subtotal = pricePerUnit.multiply(BigDecimal.valueOf(item.getQuantity()));
        dto.setSubtotal(subtotal);

        return dto;
    }

    @Transactional
    @Override
    public void clearCart() {
        cartItemRepository.deleteByUsername(this.getUsername());
    }

    @Transactional
    @Override
    public boolean deleteItemFromCart(String productId) {
        String username = this.getUsername();
        if (productId != null && !productId.isBlank()) {
            cartItemRepository.deleteByUsernameAndProductId(username, productId);
            return true;
        }
        return false;
    }
}