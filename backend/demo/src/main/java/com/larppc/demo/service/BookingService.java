
package com.larppc.demo.service;

import com.larppc.demo.entity.*;
import com.larppc.demo.repository.BookingRepository;
import com.larppc.demo.repository.ComputerRepository;
import com.larppc.demo.repository.TariffRepository;
import com.larppc.demo.repository.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ComputerRepository computerRepository;
    private final UserRepository userRepository;
    private final TariffRepository tariffRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ComputerRepository computerRepository,
            UserRepository userRepository,
            TariffRepository tariffRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.computerRepository = computerRepository;
        this.userRepository = userRepository;
        this.tariffRepository = tariffRepository;
    }

    @Transactional
    public Booking createBooking(
            Long userId,
            Long computerId,
            Long tariffId,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException(
                    "Требуется начальное и конечное время"
            );
        }

        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException(
                    "Время начала должно быть раньше времени окончания"
            );
        }

        if (!startTime.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Бронирование должно начаться в будущем"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Пользователь не найден"));

        Computer computer = computerRepository.findById(computerId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Компьютер не найден"));

        if (computer.getStatus() == ComputerStatus.DISABLED) {
            throw new IllegalArgumentException("Компьютер выключен");
        }

        Tariff tariff = tariffRepository.findById(tariffId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Тариф не найден"));

        if (!Boolean.TRUE.equals(tariff.getActive())) {
            throw new IllegalArgumentException("Тариф неактивен");
        }

        if (!computer.getRoom().getId().equals(tariff.getRoom().getId())) {
            throw new IllegalArgumentException(
                    "Тариф не подходит для зала этого компьютера"
            );
        }

        Duration duration = Duration.between(startTime, endTime);

        long seconds = duration.getSeconds();

        if (seconds % 60 != 0) {
            throw new IllegalArgumentException(
                    "Время бронирования должно быть указано с точностью до минуты"
            );
        }

        long durationMinutes = seconds / 60;

        BigDecimal priceAtBooking;

        if (tariff.getTariffType() == TariffType.HOURLY) {

            BigDecimal hours = BigDecimal.valueOf(durationMinutes)
                    .divide(BigDecimal.valueOf(60), 6, RoundingMode.HALF_UP);

            priceAtBooking = tariff.getPrice()
                    .multiply(hours)
                    .setScale(2, RoundingMode.HALF_UP);

        } else if (tariff.getTariffType() == TariffType.PACKAGE) {

            if (tariff.getDurationMinutes() == null
                    || durationMinutes != tariff.getDurationMinutes()) {
                throw new IllegalArgumentException(
                        "Длительность бронирования должна совпадать "
                                + "с длительностью пакета"
                );
            }

            priceAtBooking = tariff.getPrice();

        } else {
            throw new IllegalArgumentException("Неизвестный тип тарифа");
        }

        boolean hasConflict =
                bookingRepository.existsOverlappingBooking(
                        computerId,
                        BookingStatus.ACTIVE,
                        startTime,
                        endTime
                );

        if (hasConflict) {
            throw new IllegalArgumentException(
                    "Компьютер уже забронирован на это время"
            );
        }

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setComputer(computer);
        booking.setTariff(tariff);
        booking.setPriceAtBooking(priceAtBooking);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
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
    public void cancelBooking(Long bookingId, Long userId) {

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("Бронирование не найдено"));

        if (!booking.getUser().getId().equals(userId)) { throw new IllegalStateException("Нельзя отменить бронирование другого пользователя"); }

        if (booking.getStatus() != BookingStatus.ACTIVE) { throw new IllegalStateException("Можно отменять только активные бронирования");}

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Transactional
    public void adminCancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("Бронирование не найдено"));

        if (booking.getStatus() != BookingStatus.ACTIVE) { throw new IllegalStateException("Можно отменить только активное бронирование");}

        booking.setStatus(BookingStatus.CANCELLED);
    }

    @Transactional (readOnly = true)
    public List<Booking> getAllBookings(){ return bookingRepository.findAll(); }

    @Transactional
    public int completeExpiredBookings() {
        List<Booking> bookings = bookingRepository.findByStatusAndEndTimeLessThanEqual(BookingStatus.ACTIVE, LocalDateTime.now());

        for (Booking booking : bookings) { booking.setStatus(BookingStatus.COMPLETED); }

        return bookings.size();
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void autoCompleteBookings() {
        System.out.println("Автопроверка бронирований: " + LocalDateTime.now());

        int completed = completeExpiredBookings();

        System.out.println("Завершено бронирований: " + completed);
    }
}
