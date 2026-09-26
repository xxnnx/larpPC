package com.larppc.demo.controller;

import com.larppc.demo.dto.AuthResponse;
import com.larppc.demo.dto.UserLoginRequest;
import com.larppc.demo.dto.UserRegisterRequest;
import com.larppc.demo.dto.UserResponse;
import com.larppc.demo.entity.User;
import com.larppc.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody UserRegisterRequest request) {

        User user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserLoginRequest request) {
        
        return userService.loginUser(request.getEmail(), request.getPassword()).map(
                user -> {
                        UserResponse userResponse = new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole(),
                                user.getCreatedAt()
                        );

                        return ResponseEntity.ok(
                                new AuthResponse("Успешный вход", userResponse)
                        );
                }).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
}