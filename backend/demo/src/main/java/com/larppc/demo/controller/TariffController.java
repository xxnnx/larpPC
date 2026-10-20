
package com.larppc.demo.controller;

import com.larppc.demo.dto.TariffCreateRequest;
import com.larppc.demo.dto.TariffResponse;
import com.larppc.demo.service.TariffService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tariffs")
public class TariffController {

    private final TariffService tariffService;

    public TariffController(TariffService tariffService) {
        this.tariffService = tariffService;
    }

    @GetMapping
    public List<TariffResponse> getAllTariffs() {
        return tariffService.getAllTariffs();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TariffResponse createTariff(
            @RequestBody TariffCreateRequest request
    ) {
        return tariffService.createTariff(request);
    }

    @GetMapping("/room/{roomId}")
    public List<TariffResponse> getTariffsByRoom(
            @PathVariable Long roomId
    ) {
        return tariffService.getActiveTariffsByRoom(roomId);
    }
}
