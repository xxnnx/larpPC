// теперь сервер принимает от фронтенда post запрос

package com.larppc.demo.dto;

public class UserLoginRequest {

    private String email;
    private String password;

    public UserLoginRequest() { }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    
}
