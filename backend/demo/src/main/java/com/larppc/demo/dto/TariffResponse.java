
package com.larppc.demo.dto;

import com.larppc.demo.entity.Tariff;
import com.larppc.demo.entity.TariffType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TariffResponse {

    private Long id;
    private Long roomId;
    private String roomName;
    private String name;
    private TariffType tariffType;
    private BigDecimal price;
    private Integer durationMinutes;
    private Boolean active;
    private LocalDateTime createdAt;

    public TariffResponse(Tariff tariff) {
        this.id = tariff.getId();
        this.roomId = tariff.getRoom().getId();
        this.roomName = tariff.getRoom().getName();
        this.name = tariff.getName();
        this.tariffType = tariff.getTariffType();
        this.price = tariff.getPrice();
        this.durationMinutes = tariff.getDurationMinutes();
        this.active = tariff.getActive();
        this.createdAt = tariff.getCreatedAt();
    }

    public Long getId() { return id; }
    public Long getRoomId() { return roomId; }
    public String getRoomName() { return roomName; }
    public String getName() { return name; }
    public TariffType getTariffType() { return tariffType; }
    public BigDecimal getPrice() { return price; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Boolean getActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
