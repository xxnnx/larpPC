package com.larppc.demo.controller;

import com.larppc.demo.dto.ComputerResponse;
import com.larppc.demo.dto.RoomResponse;
import com.larppc.demo.service.ComputerService;
import com.larppc.demo.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final ComputerService computerService;
    private final RoomService roomService;

    public RoomController(RoomService roomService, ComputerService computerService) {
        this.roomService = roomService;
        this.computerService = computerService;
    }

    @GetMapping
    public List<RoomResponse> getAllRooms() {
        return roomService.getAllRooms().stream().map(RoomResponse::new).toList();
    }

    @GetMapping("/{id}")
    public RoomResponse getRoomById(@PathVariable Long id) {
        return new RoomResponse(roomService.getRoomById(id));
    }

    @GetMapping("/{id}/computers")
    public List<ComputerResponse> getComputersByRoom(@PathVariable Long id) {
        return computerService.getComputersByRoom(id).stream().map(ComputerResponse::new).toList();
    }
    
}