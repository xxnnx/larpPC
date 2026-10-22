package com.larppc.demo.dto;

import com.larppc.demo.entity.Room;

public class RoomResponse {

    private Long id;
    private String name;
    private String description;

    public RoomResponse(Room room) {
        this.id = room.getId();
        this.name = room.getName();
        this.description = room.getDescription();
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getDescription() { return description; }
}