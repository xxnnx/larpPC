package com.larppc.demo.repository;

import com.larppc.demo.entity.BookingStatus;
import com.larppc.demo.entity.Computer;
import com.larppc.demo.entity.ComputerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ComputerRepository extends JpaRepository<Computer, Long> {

    Optional<Computer> findByNumber(Integer number);

    boolean existsByNumber(Integer number);

    List<Computer> findByStatus(ComputerStatus status);

    List<Computer> findByRoomId(Long roomId);

    @Query("""
        SELECT c
        FROM Computer c
        WHERE c.room.id = :roomId
          AND c.status = :computerStatus
          AND NOT EXISTS (
              SELECT b.id
              FROM Booking b
              WHERE b.computer = c
                AND b.status = :bookingStatus
                AND b.startTime < :endTime
                AND b.endTime > :startTime
          )
        """)
    List<Computer> findAvailableComputers(
            @Param("roomId") Long roomId,
            @Param("computerStatus") ComputerStatus computerStatus,
            @Param("bookingStatus") BookingStatus bookingStatus,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
