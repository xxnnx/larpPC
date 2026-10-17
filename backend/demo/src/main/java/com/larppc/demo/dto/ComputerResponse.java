package com.larppc.demo.dto;

import java.time.LocalDateTime;

import com.larppc.demo.entity.Computer;
import com.larppc.demo.entity.ComputerStatus;

public class ComputerResponse {

    private Long id;
    private Long roomId;
    private String name;
    private ComputerStatus status;
    private Integer number;
    private LocalDateTime createdAt;


    public ComputerResponse(Computer computer) {
        this.id = computer.getId();
        this.name = computer.getName();
        this.status = computer.getStatus();
        this.number = computer.getNumber();
        this.createdAt = computer.getCreatedAt();
        this.roomId = computer.getRoom() != null ? computer.getRoom().getId() : null;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getNumber() {
        return number;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public ComputerStatus getStatus() {
        return status;
    }

    public Long getRoomId() {
        return roomId;
    }
}
