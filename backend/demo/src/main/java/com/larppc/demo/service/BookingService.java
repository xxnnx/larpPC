package com.larppc.demo.service;

import com.larppc.demo.controller.AuthController;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.larppc.demo.entity.Booking;
import com.larppc.demo.entity.BookingStatus;
import com.larppc.demo.entity.Computer;
import com.larppc.demo.entity.User;
import com.larppc.demo.repository.BookingRepository;
import com.larppc.demo.repository.ComputerRepository;
import com.larppc.demo.repository.UserRepository;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ComputerRepository computerRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, ComputerRepository computerRepository, UserRepository userRepository, AuthController authController) {
        this.bookingRepository = bookingRepository;
        this.computerRepository = computerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(Long userId, Long computerId, LocalDateTime startTime, LocalDateTime endTime){
        if (startTime == null || endTime == null) {throw new IllegalArgumentException("Требуется начальное и конечное время"); }
        if (!startTime.isBefore(endTime)) {throw new IllegalArgumentException("Время начала должно быть раньше времени окончания");}
        if (!startTime.isAfter(LocalDateTime.now())) {throw new IllegalArgumentException("Бронирование должно начаться в будущем");}

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));
        Computer computer = computerRepository.findById(computerId).orElseThrow(() -> new IllegalArgumentException("Компьютер не найден"));

        if (computer.getStatus().name().equals("DISABLED")){throw new IllegalArgumentException("Компьютер выключен");}
        
        boolean hasConflict = bookingRepository.existsOverlappingBooking(computerId, BookingStatus.ACTIVE, startTime, endTime);
        if (hasConflict) {throw new IllegalArgumentException("Компьютер уже забронирован на это время");}

        Booking booking = new Booking();

        booking.setUser(user); booking.setComputer(computer); booking.setStartTime(startTime); booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.ACTIVE);
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Пользователь не найден");
        }

        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public void cancelBooking(Long bookingid, Long userId){
        Booking booking = bookingRepository.findById(bookingid).orElseThrow(() -> new IllegalArgumentException("Бронирование не найдено"));

        if (!booking.getUser().getId().equals(userId)) { throw new IllegalStateException("Нельзя отменить бронирование другого пользователя"); }
        if (booking.getStatus() != BookingStatus.ACTIVE) { throw new IllegalStateException("Можно отменять только активные бронирования"); }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}