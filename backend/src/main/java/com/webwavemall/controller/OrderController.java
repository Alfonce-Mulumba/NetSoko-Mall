package com.webwavemall.controller;

import com.webwavemall.model.CartItem;
import com.webwavemall.model.OrderEntity;
import com.webwavemall.model.User;
import com.webwavemall.repository.CartItemRepository;
import com.webwavemall.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {
    private final OrderService orderService;
    private final CartItemRepository cartItemRepository;

    public OrderController(OrderService orderService, CartItemRepository cartItemRepository) {
        this.orderService = orderService;
        this.cartItemRepository = cartItemRepository;
    }

    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(@AuthenticationPrincipal User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        if (items.isEmpty()) throw new RuntimeException("Cart is empty");
        OrderEntity o = orderService.createOrder(user, items);
        // optionally clear cart
        items.forEach(cartItemRepository::delete);
        return ResponseEntity.ok(o);
    }

    @GetMapping
    public ResponseEntity<List<OrderEntity>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrdersForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }
}
