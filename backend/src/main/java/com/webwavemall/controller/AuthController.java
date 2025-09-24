package com.webwavemall.controller;

import com.webwavemall.model.User;
import com.webwavemall.repository.UserRepository;
import com.webwavemall.service.AuthService;
import com.webwavemall.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String phone = body.getOrDefault("phone", null);
        User u = authService.register(name, email, password, phone);
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(Map.of("user", u, "token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String token = authService.login(email, password);
        User u = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(Map.of("user", u, "token", token));
    }
}
