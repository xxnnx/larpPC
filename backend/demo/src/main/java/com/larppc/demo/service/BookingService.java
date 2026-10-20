
package com.larppc.demo.service;

import com.larppc.demo.entity.*;
import com.larppc.demo.repository.BookingRepository;
import com.larppc.demo.repository.ComputerRepository;
import com.larppc.demo.repository.TariffRepository;
import com.larppc.demo.repository.UserRepository;

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
        // 1. Проверяем время
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

        // 2. Получаем пользователя и компьютер
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Пользователь не найден"));

        Computer computer = computerRepository.findById(computerId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Компьютер не найден"));

        if (computer.getStatus() == ComputerStatus.DISABLED) {
            throw new IllegalArgumentException("Компьютер выключен");
        }

        // 3. Получаем тариф
        Tariff tariff = tariffRepository.findById(tariffId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Тариф не найден"));

        if (!Boolean.TRUE.equals(tariff.getActive())) {
            throw new IllegalArgumentException("Тариф неактивен");
        }

        // 4. Проверяем, что тариф подходит залу компьютера
        if (!computer.getRoom().getId().equals(tariff.getRoom().getId())) {
            throw new IllegalArgumentException(
                    "Тариф не подходит для зала этого компьютера"
            );
        }

        // 5. Рассчитываем длительность
        Duration duration = Duration.between(startTime, endTime);

        long seconds = duration.getSeconds();

        if (seconds % 60 != 0) {
            throw new IllegalArgumentException(
                    "Время бронирования должно быть указано с точностью до минуты"
            );
        }

        long durationMinutes = seconds / 60;

        // 6. Рассчитываем стоимость
        BigDecimal priceAtBooking;

        if (tariff.getTariffType() == TariffType.HOURLY) {

            // Почасовой тариф: разрешаем целое и дробное число часов
            BigDecimal hours = BigDecimal.valueOf(durationMinutes)
                    .divide(BigDecimal.valueOf(60), 6, RoundingMode.HALF_UP);

            priceAtBooking = tariff.getPrice()
                    .multiply(hours)
                    .setScale(2, RoundingMode.HALF_UP);

        } else if (tariff.getTariffType() == TariffType.PACKAGE) {

            // Пакет: длительность должна совпадать с длительностью тарифа
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

        // 7. Проверяем пересечение с другими бронированиями
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

        // 8. Создаём бронирование
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

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Бронирование не найдено"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalStateException(
                    "Нельзя отменить бронирование другого пользователя"
            );
        }

        if (booking.getStatus() != BookingStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Можно отменять только активные бронирования"
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}
