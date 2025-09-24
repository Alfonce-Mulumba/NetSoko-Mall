package com.webwavemall.service;

import com.webwavemall.model.User;
import com.webwavemall.repository.UserRepository;
import com.webwavemall.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User register(String name, String email, String password, String phone) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
        u.setPhone(phone);
        return userRepository.save(u);
    }

    public String login(String email, String password) {
        Optional<User> ou = userRepository.findByEmail(email);
        if (ou.isEmpty()) throw new RuntimeException("Invalid credentials");
        User u = ou.get();
        if (!BCrypt.checkpw(password, u.getPasswordHash())) throw new RuntimeException("Invalid credentials");
        // use email as subject
        return jwtUtil.generateToken(u.getEmail());
    }
}
