
package com.larppc.demo.dto;

import com.larppc.demo.entity.Game;
import java.time.LocalDateTime;

public class GameResponse {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    public GameResponse(Game game) {
        this.id = game.getId();
        this.name = game.getName();
        this.description = game.getDescription();
        this.imageUrl = game.getImageUrl();
        this.createdAt = game.getCreatedAt();
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getDescription() { return description; }

    public String getImageUrl() { return imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
