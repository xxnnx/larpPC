package com.larppc.demo.repository;

import com.larppc.demo.entity.Booking;
import com.larppc.demo.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByComputerId(Long computerId);

    List<Booking> findByUserIdAndStatus(
            Long userId,
            BookingStatus status
    );

    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.computer.id = :computerId
          AND b.status = :status
          AND b.startTime < :endTime
          AND b.endTime > :startTime
    """)
    boolean existsOverlappingBooking(
            @Param("computerId") Long computerId,
            @Param("status") BookingStatus status,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
