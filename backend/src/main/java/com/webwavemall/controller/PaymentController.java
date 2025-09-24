package com.webwavemall.controller;

import com.webwavemall.model.OrderEntity;
import com.webwavemall.model.Payment;
import com.webwavemall.model.User;
import com.webwavemall.repository.OrderRepository;
import com.webwavemall.repository.PaymentRepository;
import com.webwavemall.service.MpesaService;
import com.webwavemall.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {
    private final MpesaService mpesaService;
    private final OrderService orderService;
    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;

    public PaymentController(MpesaService mpesaService, OrderService orderService, OrderRepository orderRepo, PaymentRepository paymentRepo) {
        this.mpesaService = mpesaService;
        this.orderService = orderService;
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
    }

    @PostMapping("/mpesa")
    public ResponseEntity<?> stkPush(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        // body: phone, orderId (optional), amount, items
        String phone = String.valueOf(body.get("phone"));
        Double amount = Double.valueOf(String.valueOf(body.get("amount")));
        String accountRef = body.getOrDefault("orderId", "WEBWAVE").toString();
        String desc = "Order payment";

        Map<String, Object> resp = mpesaService.initiateStkPush(phone, amount, accountRef, desc);

        // create payment record with PENDING
        Payment p = new Payment();
        if (body.get("orderId") != null) {
            Long orderId = Long.valueOf(String.valueOf(body.get("orderId")));
            OrderEntity oe = orderRepo.findById(orderId).orElse(null);
            p.setOrder(oe);
        }
        p.setAmount(amount);
        p.setProvider("MPESA");
        p.setProviderRef(String.valueOf(resp.getOrDefault("CheckoutRequestID", resp.get("ResponseCode"))));
        p.setStatus("PENDING");
        paymentRepo.save(p);

        return ResponseEntity.ok(resp);
    }

    // M-Pesa webhook endpoint (Daraja will POST here)
    @PostMapping("/webhooks/mpesa")
    public ResponseEntity<?> mpesaWebhook(@RequestBody Map<String, Object> payload) {
        // Daraja sends a nested JSON structure; applications differ.
        // We'll persist the callback in payments and update order if payment success
        try {
            // parse callback for CheckoutRequestID and ResultCode
            Map<String, Object> body = (Map<String, Object>) payload.get("Body");
            if (body != null && body.get("stkCallback") != null) {
                Map<String, Object> stk = (Map<String, Object>) body.get("stkCallback");
                Integer resultCode = (Integer) stk.get("ResultCode");
                String checkoutReqId = String.valueOf(stk.get("CheckoutRequestID"));
                if (resultCode == 0) {
                    // successful payment - update payment record(s)
                    Payment payment = paymentRepo.findAll().stream()
                            .filter(pp -> checkoutReqId.equals(pp.getProviderRef()))
                            .findFirst().orElse(null);
                    if (payment != null) {
                        payment.setStatus("SUCCESS");
                        paymentRepo.save(payment);
                        if (payment.getOrder() != null) {
                            orderService.markPaid(payment.getOrder().getId());
                        }
                    }
                } else {
                    // failed
                    Payment payment = paymentRepo.findAll().stream()
                            .filter(pp -> checkoutReqId.equals(pp.getProviderRef()))
                            .findFirst().orElse(null);
                    if (payment != null) {
                        payment.setStatus("FAILED");
                        paymentRepo.save(payment);
                    }
                }
            }
        } catch (Exception ex) {
            // log but return 200 to M-Pesa
            ex.printStackTrace();
        }
        return ResponseEntity.ok(Map.of("result", "received"));
    }
}
