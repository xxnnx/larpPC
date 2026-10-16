package com.larppc.demo.service;

import com.larppc.demo.entity.Room;
import com.larppc.demo.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Transactional(readOnly = true)
    public List<Room> getAllRooms() { return roomRepository.findAll(); }

    @Transactional(readOnly = true)
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Комната не найдена"));
    }
}