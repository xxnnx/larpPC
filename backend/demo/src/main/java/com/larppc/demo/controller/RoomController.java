package com.larppc.demo.controller;

import com.larppc.demo.dto.RoomResponse;
import com.larppc.demo.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<RoomResponse> getAllRooms() {
        return roomService.getAllRooms().stream().map(RoomResponse::new).toList();
    }

    @GetMapping("/{id}")
    public RoomResponse getRoomById(@PathVariable Long id) {
        return new RoomResponse(roomService.getRoomById(id));
    }
}