// userRespone создался для того чтобы сделать ответ сервера безопасным
// и passwordhash не был виден в ответе, запись происходит через userService


package com.larppc.demo.dto;

import com.larppc.demo.entity.Role;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime createdAt;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            String name,
            String email,
            Role role,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}