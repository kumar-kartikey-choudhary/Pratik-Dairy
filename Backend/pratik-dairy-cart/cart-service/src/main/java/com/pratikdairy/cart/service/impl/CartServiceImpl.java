package com.pratikdairy.cart.service.impl;

import com.pratikdairy.cart.dto.AddToCart;
import com.pratikdairy.cart.dto.CartItemDto;
import com.pratikdairy.cart.entity.CartItem;
import com.pratikdairy.cart.repository.CartItemRepository;
import com.pratikdairy.cart.service.CartService;
import com.pratikdairy.cart.util.*;
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

    // ---------- NEW: single source of truth for fetching product ----------
    private ProductDto fetchProduct(String productId) {
        ResponseEntity<ProductDto> response = controller.find(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("ProductNotFoundException: Could not fetch product details for id " + productId);
        }
        return response.getBody();
    }

    @Override
    @Transactional
    public boolean addItemToCart(AddToCart request) {
        log.info("Inside @class CartServiceImpl @method addItemToCart Adding item {} to cart", request.getProductId());
        String username = this.getUsername();

        // Weight is client-selected but ALWAYS validated here. Never trust a price from the client
        String weight = (request.getWeight() == null || request.getWeight().isBlank()) ? "1kg" : request.getWeight().trim().toLowerCase();

        ProductDto productDto = fetchProduct(request.getProductId());

        if (productDto.getStockQuantity() < request.getQuantity()) {
            return false;
        }

        CartItem existingItem = cartItemRepository.findByUsernameAndProductIdAndWeight(username, productDto.getId(), weight);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.saveAndFlush(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUsername(username);
            cartItem.setProductId(productDto.getId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setWeight(weight);
            cartItemRepository.saveAndFlush(cartItem);
        }
        return true;
    }

    @Override
    @Transactional
    public CartItemDto updateQuantity(String productId, int quantity) {
        String username = this.getUsername();
        log.info("updateQuantity: username={}, productId={}, quantity={}", username, productId, quantity);

        if (quantity <= 0) {
            cartItemRepository.deleteByUsernameAndProductId(username, productId);
            return null;
        }

        CartItem cartItem = cartItemRepository.findByUsernameAndProductId(username, productId);
        if (cartItem == null) {
            return null;
        }

        ProductDto productDto = fetchProduct(productId);

        if (quantity > cartItem.getQuantity() && productDto.getStockQuantity() < quantity) {
            throw new RuntimeException("Only " + productDto.getStockQuantity() + " unit(s) available");
        }

        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.saveAndFlush(cartItem);

        return toDto(cartItem, productDto);
    }

    @Transactional
    @Override
    public List<CartItemDto> getCart() {
        log.info("Inside @class CartServiceImpl @method getCart");
        String username = this.getUsername();

        return cartItemRepository.findByUsername(username).stream()
                .map(item -> {
                    ProductDto productDto = fetchProduct(item.getProductId());
                    return toDto(item, productDto);
                })
                .toList();
    }

    // ---------- CHANGED: ab CartItem + ProductDto dono se DTO banata hai ----------
    private CartItemDto toDto(CartItem item, ProductDto productDto) {
        CartItemDto dto = new CartItemDto();
        dto.setUsername(item.getUsername());
        dto.setProductId(item.getProductId());
        dto.setQuantity(item.getQuantity());

        dto.setProductName(productDto.getProductName());
        dto.setProductImageUrl(productDto.getImageData());
        dto.setUnit(productDto.getStockUnit());
        dto.setWeight(item.getWeight());

        // Price is ALWAYS recalculated here from base price + weight — never read from the client.
        // Multiplier is relative to THIS product's own stockUnit (e.g. Buffalo Ghee is priced per "1kg").
        BigDecimal pricePerUnit = WeightPricing.priceFor(productDto.getPrice(), item.getWeight(), productDto.getStockUnit());
        dto.setPricePerUnit(pricePerUnit);

        BigDecimal subtotal = pricePerUnit.multiply(BigDecimal.valueOf(item.getQuantity()));
        dto.setSubtotal(subtotal);

        return dto;
    }

    @Transactional
    @Override
    public void clearCart() {
        log.info("Inside @class CartServiceImpl @method clearCart");
        String username = this.getUsername();
        cartItemRepository.deleteByUsername(username);
    }

    @Transactional
    @Override
    public boolean deleteItemFromCart(String productId) {
        log.info("Inside @class CartServiceImpl @method deleteItemFromCart");
        String username = this.getUsername();
        if (!productId.isEmpty() && !username.isEmpty()) {
            cartItemRepository.deleteByUsernameAndProductId(username, productId);
            return true;
        }
        return false;
    }
}