package com.larppc.demo.controller;

import com.larppc.demo.dto.GameRequest;
import com.larppc.demo.dto.GameResponse;
import com.larppc.demo.service.GameService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<GameResponse> getAllGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public GameResponse getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @PostMapping
    public GameResponse createGame(@RequestBody GameRequest request) {
        return gameService.createGame(request);
    }

    @PutMapping("/{id}")
    public GameResponse updateGame(
            @PathVariable Long id,
            @RequestBody GameRequest request
    ) {
        return gameService.updateGame(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
}