package com.larppc.demo.dto;

import com.larppc.demo.entity.Booking;
import com.larppc.demo.entity.BookingStatus;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long computerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private LocalDateTime createdAt;

    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        this.computerId = booking.getComputer().getId();
        this.startTime = booking.getStartTime();
        this.endTime = booking.getEndTime();
        this.status = booking.getStatus();
        this.createdAt = booking.getCreatedAt();
    }

    public Long getId() { return id; }
    public Long getComputerId() { return computerId; }

    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }

    public BookingStatus getStatus() { return status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}