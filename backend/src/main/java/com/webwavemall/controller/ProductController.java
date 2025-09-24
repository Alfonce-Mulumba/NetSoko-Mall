package com.webwavemall.controller;

import com.webwavemall.model.Product;
import com.webwavemall.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    private final ProductService svc;

    public ProductController(ProductService svc) { this.svc = svc; }

    @GetMapping
    public ResponseEntity<List<Product>> list() {
        return ResponseEntity.ok(svc.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id) {
        return svc.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product p) {
        return ResponseEntity.ok(svc.create(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
        return ResponseEntity.ok(svc.update(id, p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
