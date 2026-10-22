
package com.larppc.demo.dto;

import com.larppc.demo.entity.TariffType;

import java.math.BigDecimal;

public class TariffCreateRequest {

    private Long roomId;
    private String name;
    private TariffType tariffType;
    private BigDecimal price;
    private Integer durationMinutes;

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public TariffType getTariffType() { return tariffType; }
    public void setTariffType(TariffType tariffType) {
        this.tariffType = tariffType;
    }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
