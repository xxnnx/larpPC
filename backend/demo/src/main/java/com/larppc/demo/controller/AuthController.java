package com.larppc.demo.controller;

import com.larppc.demo.dto.AuthResponse;
import com.larppc.demo.dto.UserLoginRequest;
import com.larppc.demo.dto.UserRegisterRequest;
import com.larppc.demo.dto.UserResponse;
import com.larppc.demo.entity.User;
import com.larppc.demo.security.JwtService;
import com.larppc.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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

                        String token = jwtService.generateToken(user);

                        return ResponseEntity.ok(
                                new AuthResponse("Успешный вход", userResponse, token)
                        );
                }).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
}