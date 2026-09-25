package com.larppc.demo.service;

import com.larppc.demo.entity.Computer;
import com.larppc.demo.repository.ComputerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComputerService {

    private final ComputerRepository computerRepository;

    public ComputerService(ComputerRepository computerRepository) {
        this.computerRepository = computerRepository;
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
}