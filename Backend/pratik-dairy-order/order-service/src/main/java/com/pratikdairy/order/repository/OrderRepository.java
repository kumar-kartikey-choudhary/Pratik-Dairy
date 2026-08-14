package com.pratikdairy.order.repository;

import com.pratikdairy.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    @Query("SELECT o FROM ORDER_HEADER o WHERE o.username= :username")
    List<Order> findByUsername(@Param("username") String username);
}
