package com.larppc.demo.repository;

import com.larppc.demo.entity.Booking;
import com.larppc.demo.entity.BookingStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
        
    @EntityGraph(attributePaths = {"computer", "tariff"})
    List<Booking> findByUserId(Long userId);

    List<Booking> findByComputerId(Long computerId);

    List<Booking> findByUserIdAndStatus(
            Long userId,
            BookingStatus status
    );

    @EntityGraph(attributePaths = {"computer", "tariff"})
    @Override
    List<Booking> findAll();

    List<Booking> findByStatusAndEndTimeLessThanEqual( BookingStatus status, LocalDateTime time );

    // проверка пересечения бронирований. (учитываются только активные бронирования)
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
    boolean existsByComputerIdAndStatus(Long computerId,BookingStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.id = :bookingId")
    Optional<Booking> findByIdForUpdate(@Param("bookingId") Long bookingId);
}
