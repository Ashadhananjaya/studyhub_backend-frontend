package com.studyhub.studyhub.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyhub.studyhub.model.User;
import com.studyhub.studyhub.security.JwtUtil;
import com.studyhub.studyhub.service.UserService;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

 @PostMapping("/signup")
public User signup(@Valid @RequestBody User user) {
    return userService.register(user);
}

    @GetMapping("/test")
    public String test() {
        return "Auth Controller Working!";
    }
@PostMapping("/login")
public Map<String, String> login(@RequestBody User user) {

    String token = userService.login(user.getEmail(), user.getPassword());

    return Map.of("token", token);
}
}