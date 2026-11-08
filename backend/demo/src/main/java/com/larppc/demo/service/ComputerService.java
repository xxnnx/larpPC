package com.larppc.demo.service;

import com.larppc.demo.entity.BookingStatus;
import com.larppc.demo.entity.Computer;
import com.larppc.demo.entity.ComputerStatus;
import com.larppc.demo.entity.Tariff;
import com.larppc.demo.entity.TariffType;
import com.larppc.demo.repository.BookingRepository;
import com.larppc.demo.repository.ComputerRepository;
import com.larppc.demo.repository.RoomRepository;
import com.larppc.demo.repository.TariffRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
public class ComputerService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final ComputerRepository computerRepository;
    private final TariffRepository tariffRepository;

    public ComputerService(ComputerRepository computerRepository, RoomRepository roomRepository, BookingRepository bookingRepository, TariffRepository tariffRepository) {
        this.computerRepository = computerRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.tariffRepository = tariffRepository;
    }

    public List<Computer> getAllComputers() {
        return computerRepository.findAll();
    }

    public Optional<Computer> getComputerById(Long id) {
        return computerRepository.findById(id);
    }

    public Computer createComputer(Computer computer, Long roomId) {
        var room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Зал не найден"));
        if (computerRepository.existsByNumber(computer.getNumber())) {throw new IllegalArgumentException("Компьютер с таким номером уже существует");}
        computer.setRoom(room);
        return computerRepository.save(computer);
    }

    @Transactional 
    public Optional<Computer> updateComputer(Long id, Computer updatedComputer, Long roomId) {
        var room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Зал не найден"));

        return computerRepository.findById(id)
                .map(computer -> {
                    if (computerRepository.existsByNumber(updatedComputer.getNumber())
                    && !computer.getNumber().equals(updatedComputer.getNumber())) { throw new IllegalArgumentException("Компьютер с таким номером уже существует");}
                    
                    if (updatedComputer.getStatus() == ComputerStatus.DISABLED && computer.getStatus() != ComputerStatus.DISABLED) {
                        boolean hasActiveBookings = bookingRepository.existsByComputerIdAndStatus(id, BookingStatus.ACTIVE);
                        if (hasActiveBookings) throw new IllegalStateException("Нельзя отключить компьютер: существуют активные бронирования");
                    }

                    computer.setName(updatedComputer.getName());
                    computer.setStatus(updatedComputer.getStatus());
                    computer.setRoom(room);

                    return computerRepository.save(computer);
                });
    }

    @Transactional (readOnly = true)
    public List<Computer> getComputersByRoom(Long roomId){
        if (!roomRepository.existsById(roomId)) { throw new IllegalArgumentException("Комната не найдена"); }
        return computerRepository.findByRoomId(roomId);
    }


    @Transactional(readOnly = true)
    public List<Computer> getAvailableComputers(Long roomId, Long tariffId, LocalDateTime startTime, LocalDateTime endTime
    ) {
        if (!roomRepository.existsById(roomId)) { throw new IllegalArgumentException("Зал не найден"); }

        Tariff tariff = tariffRepository.findById(tariffId).orElseThrow(() -> new IllegalArgumentException("Тариф не найден"));

        if (!Boolean.TRUE.equals(tariff.getActive())) { throw new IllegalArgumentException("Тариф неактивен"); }

        if (!tariff.getRoom().getId().equals(roomId)) { throw new IllegalArgumentException("Тариф не подходит для выбранного зала"); }

        if (startTime == null || endTime == null) { throw new IllegalArgumentException("Необходимо указать время начала и окончания"); }

        if (!startTime.isAfter(LocalDateTime.now())) { throw new IllegalArgumentException("Время начала должно быть в будущем"); }

        if (!startTime.isBefore(endTime)) { throw new IllegalArgumentException("Время начала должно быть раньше окончания"); }

        long durationMinutes = Duration.between(startTime, endTime).toMinutes();

        if (Duration.between(startTime, endTime).getSeconds() % 60 != 0) { throw new IllegalArgumentException("Время должно быть указано с точностью до минуты"); }

        if (tariff.getTariffType() == TariffType.PACKAGE) {
            if (!durationMinutesEquals(tariff.getDurationMinutes(), durationMinutes)) {
                throw new IllegalArgumentException("Продолжительность бронирования не соответствует тарифу");
            }
        }

        return computerRepository.findAvailableComputers(roomId, ComputerStatus.AVAILABLE, BookingStatus.ACTIVE, startTime, endTime);
    }

    private boolean durationMinutesEquals(Integer tariffDuration, long requestedDuration) {
        return tariffDuration != null && tariffDuration == requestedDuration;
    }

}