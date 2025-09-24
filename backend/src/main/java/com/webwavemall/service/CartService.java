package com.webwavemall.service;

import com.webwavemall.model.CartItem;
import com.webwavemall.model.Product;
import com.webwavemall.model.User;
import com.webwavemall.repository.CartItemRepository;
import com.webwavemall.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;

    public CartService(CartItemRepository cartRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    public List<CartItem> getCartForUser(User user) {
        return cartRepo.findByUser(user);
    }

    public CartItem addItem(User user, Long productId, int qty) {
        Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        List<CartItem> existing = cartRepo.findByUser(user);
        for (CartItem ci : existing) {
            if (ci.getProduct().getId().equals(productId)) {
                ci.setQty(ci.getQty() + qty);
                return cartRepo.save(ci);
            }
        }
        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQty(qty);
        return cartRepo.save(item);
    }

    public void removeItem(User user, Long cartItemId) {
        CartItem c = cartRepo.findById(cartItemId).orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!c.getUser().getId().equals(user.getId())) throw new RuntimeException("Not allowed");
        cartRepo.delete(c);
    }

    public CartItem updateQty(User user, Long cartItemId, int qty) {
        CartItem c = cartRepo.findById(cartItemId).orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!c.getUser().getId().equals(user.getId())) throw new RuntimeException("Not allowed");
        c.setQty(qty);
        return cartRepo.save(c);
    }

    public void clearCart(User user) {
        cartRepo.findByUser(user).forEach(cartRepo::delete);
    }
}
