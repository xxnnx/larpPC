package com.larppc.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.larppc.demo.dto.ComputerRequest;
import com.larppc.demo.entity.Computer;
import com.larppc.demo.service.ComputerService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/computers")
public class ComputerController {
    private final ComputerService computerService;

    public ComputerController(ComputerService computerService){
        this.computerService = computerService;
    }

    @GetMapping
    public List<Computer> getAllComputers(){
        return computerService.getAllComputers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Computer> getComputerById(@PathVariable Long id) {
        return computerService.getComputerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Computer createComputer(@RequestBody ComputerRequest request) {
        Computer computer = new Computer();
        
        computer.setNumber(request.getNumber());
        computer.setName(request.getName());

        if (request.getStatus() != null){
            computer.setStatus(request.getStatus());
        }
        
        return computerService.createComputer(computer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Computer> updateComputer(
            @PathVariable Long id,
            @RequestBody ComputerRequest request) {

        Computer computer = new Computer();

        computer.setNumber(request.getNumber());
        computer.setName(request.getName());
        computer.setStatus(request.getStatus());

        return computerService.updateComputer(id, computer)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    
    
    
}
