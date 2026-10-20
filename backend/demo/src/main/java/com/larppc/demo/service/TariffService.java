
package com.larppc.demo.service;

import com.larppc.demo.dto.TariffCreateRequest;
import com.larppc.demo.dto.TariffResponse;
import com.larppc.demo.entity.Room;
import com.larppc.demo.entity.Tariff;
import com.larppc.demo.entity.TariffType;
import com.larppc.demo.repository.RoomRepository;
import com.larppc.demo.repository.TariffRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TariffService {

    private final TariffRepository tariffRepository;
    private final RoomRepository roomRepository;

    public TariffService(
            TariffRepository tariffRepository,
            RoomRepository roomRepository
    ) {
        this.tariffRepository = tariffRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional(readOnly = true)
    public List<TariffResponse> getAllTariffs() {
        return tariffRepository.findAll()
                .stream()
                .map(TariffResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TariffResponse> getActiveTariffsByRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Зал не найден");
        }

        return tariffRepository.findByRoomIdAndActiveTrue(roomId)
                .stream()
                .map(TariffResponse::new)
                .toList();
    }

    @Transactional
    public TariffResponse createTariff(TariffCreateRequest request) {

        if (request.getRoomId() == null) {
            throw new IllegalArgumentException("Не указан зал");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Название тарифа обязательно");
        }

        if (request.getTariffType() == null) {
            throw new IllegalArgumentException("Не указан тип тарифа");
        }

        if (request.getPrice() == null
                || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Цена должна быть больше нуля");
        }

        if (request.getTariffType() == TariffType.HOURLY) {
            if (request.getDurationMinutes() != null) {
                throw new IllegalArgumentException(
                        "Для почасового тарифа длительность указывать не нужно"
                );
            }
        } else if (request.getTariffType() == TariffType.PACKAGE) {
            if (request.getDurationMinutes() == null
                    || request.getDurationMinutes() <= 0) {
                throw new IllegalArgumentException(
                        "Для пакета укажи длительность в минутах"
                );
            }
        }

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Зал не найден"));

        Tariff tariff = new Tariff();
        tariff.setRoom(room);
        tariff.setName(request.getName().trim());
        tariff.setTariffType(request.getTariffType());
        tariff.setPrice(request.getPrice());
        tariff.setDurationMinutes(request.getDurationMinutes());
        tariff.setActive(true);

        Tariff savedTariff = tariffRepository.save(tariff);

        return new TariffResponse(savedTariff);
    }
}
