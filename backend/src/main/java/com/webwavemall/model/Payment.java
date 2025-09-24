package com.webwavemall.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private OrderEntity order;

    private String provider; // MPESA, PAYPAL, etc.

    private String providerRef; // e.g., CheckoutRequestID

    private Double amount;

    private String status; // PENDING, SUCCESS, FAILED

    private OffsetDateTime createdAt = OffsetDateTime.now();

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public OrderEntity getOrder() { return order; }
    public void setOrder(OrderEntity order) { this.order = order; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderRef() { return providerRef; }
    public void setProviderRef(String providerRef) { this.providerRef = providerRef; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
