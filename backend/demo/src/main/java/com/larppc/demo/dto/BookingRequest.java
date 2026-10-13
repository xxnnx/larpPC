package com.larppc.demo.dto;

import java.time.LocalDateTime;


public class BookingRequest {
    private Long computerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public Long getComputerId(){ return computerId; }
    public void setComputerId(Long computerId) { this.computerId = computerId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
