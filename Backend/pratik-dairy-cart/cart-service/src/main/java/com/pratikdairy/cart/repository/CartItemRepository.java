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
    void deleteByUsernameAndProductId(String username, String productId);
    void deleteByUsername(String username);
    CartItem findByUsernameAndProductId(String username, String productId);
    List<CartItem> findByUsername(String username);
    // Same product + different weight = different cart line
    CartItem findByUsernameAndProductIdAndWeight(String username, String productId, String weight);
    void deleteByUsernameAndProductIdAndWeight(String username, String productId, String weight);
}
