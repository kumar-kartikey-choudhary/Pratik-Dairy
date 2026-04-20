package com.pratikdairy.cart.repository;

import com.pratikdairy.cart.entity.CartItem;
import com.pratikdairy.product.model.Product;
import com.pratikdairy.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    void deleteByUserIdAndProductId(String userId, String productId);
    void deleteByUserId(String userId);
    CartItem findByUserIdAndProductId(String userId, String productId);
    List<CartItem> findByUserId(String userId);
}
