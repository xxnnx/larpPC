package com.larppc.demo.repository;

import com.larppc.demo.entity.Computer;
import com.larppc.demo.entity.ComputerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComputerRepository extends JpaRepository<Computer, Long> {

    Optional<Computer> findByNumber(Integer number);

    boolean existsByNumber(Integer number);

    List<Computer> findByStatus(ComputerStatus status);
}
