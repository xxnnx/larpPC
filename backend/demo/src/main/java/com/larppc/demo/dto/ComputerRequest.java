package com.larppc.demo.dto;

import com.larppc.demo.entity.ComputerStatus;

public class ComputerRequest {

    private Integer number;
    private String name;
    private ComputerStatus status;

    public ComputerRequest() {
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ComputerStatus getStatus() {
        return status;
    }

    public void setStatus(ComputerStatus status) {
        this.status = status;
    }
}