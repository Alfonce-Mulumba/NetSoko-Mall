package com.webwavemall.service;

import com.webwavemall.model.*;
import com.webwavemall.repository.OrderRepository;
import com.webwavemall.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    public OrderEntity createOrder(User user, List<CartItem> items) {
        OrderEntity order = new OrderEntity();
        order.setOrderNumber(UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
        order.setUser(user);

        double total = 0.0;
        List<OrderItem> orderItems = items.stream().map(ci -> {
            Product p = productRepo.findById(ci.getProduct().getId()).orElseThrow(() -> new RuntimeException("Product missing"));
            OrderItem oi = new OrderItem();
            oi.setProductId(p.getId());
            oi.setTitle(p.getTitle());
            oi.setPrice(p.getPrice());
            oi.setQty(ci.getQty());
            total += p.getPrice() * ci.getQty();
            return oi;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        order.setTotal(total);
        order.setStatus("PENDING");
        return orderRepo.save(order);
    }

    public List<OrderEntity> getOrdersForUser(User user) {
        return orderRepo.findByUser(user);
    }

    public OrderEntity getOrder(Long id) {
        return orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public OrderEntity markPaid(Long orderId) {
        OrderEntity o = getOrder(orderId);
        o.setStatus("PAID");
        return orderRepo.save(o);
    }
}
