
package com.larppc.demo.service;

import com.larppc.demo.dto.GameRequest;
import com.larppc.demo.dto.GameResponse;
import com.larppc.demo.entity.Game;
import com.larppc.demo.repository.GameRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public List<GameResponse> getAllGames() {
        return gameRepository.findAll().stream().map(GameResponse::new).toList();
    }

    @Transactional(readOnly = true)
    public GameResponse getGameById(Long id) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Игра не найдена"));

        return new GameResponse(game);
    }

    @Transactional
    public GameResponse createGame(GameRequest request) {

        validateGame(request);

        if (gameRepository.existsByName(request.getName().trim())) { throw new IllegalArgumentException("Игра с таким названием уже существует");}

        Game game = new Game();
        game.setName(request.getName().trim());
        game.setDescription(request.getDescription());
        game.setImageUrl(request.getImageUrl());

        Game savedGame = gameRepository.save(game);

        return new GameResponse(savedGame);
    }

    @Transactional
    public GameResponse updateGame(Long id, GameRequest request) {
        validateGame(request);

        Game game = gameRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Игра не найдена"));

        String newName = request.getName().trim();

        if (!game.getName().equalsIgnoreCase(newName) && gameRepository.existsByName(newName)) {
            throw new IllegalArgumentException("Игра с таким названием уже существует");
        }

        game.setName(newName);
        game.setDescription(request.getDescription());
        game.setImageUrl(request.getImageUrl());

        return new GameResponse(gameRepository.save(game));
    }

    @Transactional
    public void deleteGame(Long id) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Игра не найдена"));
        gameRepository.delete(game);
    }

    private void validateGame(GameRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Название игры обязательно");
        }

        if (request.getName().trim().length() > 120) {
            throw new IllegalArgumentException("Название игры слишком длинное");
        }
    }
}
