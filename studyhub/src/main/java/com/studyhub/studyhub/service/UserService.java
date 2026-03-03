package com.studyhub.studyhub.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.studyhub.studyhub.model.User;
import com.studyhub.studyhub.repository.UserRepository;
import com.studyhub.studyhub.security.JwtUtil;

@Service
public class UserService {
    @Autowired
private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;   // ✅ YOU MISSED THIS

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 🔐 Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

 public String login(String email, String password) {

    Optional<User> optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        throw new RuntimeException("User not found");
    }

    User user = optionalUser.get();

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    // 🔐 Generate JWT
    return jwtUtil.generateToken(user.getEmail());
}
}