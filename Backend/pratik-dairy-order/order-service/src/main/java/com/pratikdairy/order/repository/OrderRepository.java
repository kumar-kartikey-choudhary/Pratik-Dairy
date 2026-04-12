package com.pratikdairy.order.repository;

import com.pratikdairy.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByCustomerId(String id);
<<<<<<< HEAD
    List<Order> findByCustomerIdOrderByOrderDateTimeDesc(String customerId);
=======
//    List<Order> findByCustomerIdOrderByOrderDateDesc(String customerId);
>>>>>>> d077dc6c66d57db3c8844f683c379dab12387ba6
}
