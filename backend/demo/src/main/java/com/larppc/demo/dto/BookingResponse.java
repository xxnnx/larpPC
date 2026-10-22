package com.larppc.demo.dto;

import com.larppc.demo.entity.Booking;
import com.larppc.demo.entity.BookingStatus;
import com.larppc.demo.entity.TariffType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long computerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private Long tariffId;
    private String tariffName;
    private TariffType tariffType;
    private BigDecimal priceAtBooking;

    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        this.computerId = booking.getComputer().getId();
        this.startTime = booking.getStartTime();
        this.endTime = booking.getEndTime();
        this.status = booking.getStatus();
        this.createdAt = booking.getCreatedAt();

        if (booking.getTariff() != null) {
            this.tariffId = booking.getTariff().getId();
            this.tariffName = booking.getTariff().getName();
            this.tariffType = booking.getTariff().getTariffType();
        }
        
        this.priceAtBooking = booking.getPriceAtBooking();
    }

    public Long getId() { return id; }
    public Long getComputerId() { return computerId; }

    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }

    public BookingStatus getStatus() { return status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Long getTariffId() { return tariffId; }

    public String getTariffName() { return tariffName; }

    public TariffType getTariffType() { return tariffType; }

    public BigDecimal getPriceAtBooking() { return priceAtBooking; }
}