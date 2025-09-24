package com.webwavemall.service;

import com.webwavemall.model.Product;
import com.webwavemall.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> listAll() {
        return repo.findAll();
    }

    public Optional<Product> findById(Long id) {
        return repo.findById(id);
    }

    public Product create(Product p) {
        return repo.save(p);
    }

    public Product update(Long id, Product update) {
        Product p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        p.setTitle(update.getTitle());
        p.setDescription(update.getDescription());
        p.setPrice(update.getPrice());
        p.setImageUrl(update.getImageUrl());
        p.setStock(update.getStock());
        p.setBrand(update.getBrand());
        return repo.save(p);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
