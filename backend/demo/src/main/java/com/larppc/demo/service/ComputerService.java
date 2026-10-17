package com.larppc.demo.service;

import com.larppc.demo.entity.Computer;
import com.larppc.demo.repository.ComputerRepository;
import com.larppc.demo.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ComputerService {

    private final RoomRepository roomRepository;
    private final ComputerRepository computerRepository;

    public ComputerService(ComputerRepository computerRepository, RoomRepository roomRepository) {
        this.computerRepository = computerRepository;
        this.roomRepository = roomRepository;
    }

    public List<Computer> getAllComputers() {
        return computerRepository.findAll();
    }

    public Optional<Computer> getComputerById(Long id) {
        return computerRepository.findById(id);
    }

    public Computer createComputer(Computer computer) {
        return computerRepository.save(computer);
    }

    public Optional<Computer> updateComputer(Long id, Computer updatedComputer) {

        return computerRepository.findById(id)
                .map(computer -> {
                    computer.setNumber(updatedComputer.getNumber());
                    computer.setName(updatedComputer.getName());
                    computer.setStatus(updatedComputer.getStatus());

                    return computerRepository.save(computer);
                });
    }

    @Transactional (readOnly = true)
    public List<Computer> getComputersByRoom(Long roomId){
        if (!roomRepository.existsById(roomId)) { throw new IllegalArgumentException("Комната не найдена"); }
        return computerRepository.findByRoomId(roomId);
    }
}