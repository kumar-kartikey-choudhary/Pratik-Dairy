package com.pratikdairy.product.repository;

import com.pratikdairy.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByProductNameContainingIgnoreCase(String name);

    // Atomic, race-condition-safe stock decrement.
    // Only succeeds (returns 1) if there is enough stock at the moment of the UPDATE.
    // This is what prevents two simultaneous orders from overselling the same product.
    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :quantity " +
            "WHERE p.id = :id AND p.stockQuantity >= :quantity")
    int decrementStock(@Param("id") String id, @Param("quantity") int quantity);

    // Used to roll back a decrement if a later item in the same order fails stock validation.
    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity + :quantity WHERE p.id = :id")
    int restoreStock(@Param("id") String id, @Param("quantity") int quantity);

}
