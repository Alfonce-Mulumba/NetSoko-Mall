package com.webwavemall.repository;

import com.webwavemall.model.OrderEntity;
import com.webwavemall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUser(User user);
}
