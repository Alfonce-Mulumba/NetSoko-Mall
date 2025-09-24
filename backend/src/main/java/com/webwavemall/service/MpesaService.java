package com.webwavemall.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MpesaService {

    @Value("${mpesa.env}")
    private String mpesaEnv;

    @Value("${mpesa.consumer-key}")
    private String consumerKey;

    @Value("${mpesa.consumer-secret}")
    private String consumerSecret;

    @Value("${mpesa.shortcode}")
    private String shortCode;

    @Value("${mpesa.passkey}")
    private String passkey;

    @Value("${mpesa.callback-url}")
    private String callbackUrl;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String getOauthToken() {
        String url = mpesaEnv.equals("production") ?
                "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" :
                "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        String credentials = consumerKey + ":" + consumerSecret;
        String base64 = Base64.getEncoder().encodeToString(credentials.getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + base64);
        HttpEntity<Void> e = new HttpEntity<>(headers);
        ResponseEntity<String> r = rest.exchange(url, HttpMethod.GET, e, String.class);
        try {
            JsonNode n = mapper.readTree(r.getBody());
            return n.get("access_token").asText();
        } catch (Exception ex) {
            throw new RuntimeException("Mpesa oauth failed: " + ex.getMessage());
        }
    }

    public Map<String, Object> initiateStkPush(String phone, double amount, String accountRef, String description) {
        String token = getOauthToken();
        String url = mpesaEnv.equals("production") ?
                "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest" :
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

        // Timestamp format yyyyMMddHHmmss
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMddHHmmss").format(LocalDateTime.now());
        String password = Base64.getEncoder().encodeToString((shortCode + passkey + timestamp).getBytes());

        Map<String, Object> body = new HashMap<>();
        body.put("BusinessShortCode", shortCode);
        body.put("Password", password);
        body.put("Timestamp", timestamp);
        body.put("TransactionType", "CustomerPayBillOnline");
        body.put("Amount", (int) Math.round(amount));
        body.put("PartyA", phone); // customer phone in format 2547XXXXXXXX
        body.put("PartyB", shortCode);
        body.put("PhoneNumber", phone);
        body.put("CallbackURL", callbackUrl);
        body.put("AccountReference", accountRef);
        body.put("TransactionDesc", description);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Map<String, Object>> e = new HttpEntity<>(body, headers);
        ResponseEntity<String> r = rest.postForEntity(url, e, String.class);
        try {
            return mapper.readValue(r.getBody(), Map.class);
        } catch (Exception ex) {
            throw new RuntimeException("STK push failed: " + ex.getMessage());
        }
    }

    // The webhook endpoint handler will parse the callback and return success.
}
