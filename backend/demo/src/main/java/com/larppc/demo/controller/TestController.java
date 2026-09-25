package com.larppc.demo.controller;

import com.larppc.demo.entity.Computer;
import com.larppc.demo.repository.ComputerRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {

    private final ComputerRepository computerRepository;

    public TestController(ComputerRepository computerRepository) {
        this.computerRepository = computerRepository;
    }

    @GetMapping("/test/computers")
    public List<Computer> getComputers() {
        return computerRepository.findAll();
    }
}