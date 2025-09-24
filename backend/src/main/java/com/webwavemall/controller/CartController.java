package com.webwavemall.controller;

import com.webwavemall.model.CartItem;
import com.webwavemall.model.User;
import com.webwavemall.repository.UserRepository;
import com.webwavemall.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartForUser(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartItem> add(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(String.valueOf(body.get("productId")));
        int qty = Integer.parseInt(String.valueOf(body.getOrDefault("qty", 1)));
        return ResponseEntity.ok(cartService.addItem(user, productId, qty));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartItem> update(@AuthenticationPrincipal User user,
                                           @PathVariable Long id,
                                           @RequestBody Map<String, Object> body) {
        int qty = Integer.parseInt(String.valueOf(body.getOrDefault("qty", 1)));
        return ResponseEntity.ok(cartService.updateQty(user, id, qty));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> remove(@AuthenticationPrincipal User user, @PathVariable Long id) {
        cartService.removeItem(user, id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
