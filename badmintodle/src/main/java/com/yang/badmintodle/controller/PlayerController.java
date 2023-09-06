package com.yang.badmintodle.controller;
import com.yang.badmintodle.model.Player;
import com.yang.badmintodle.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/v1/api/players")
public class PlayerController {
    private PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService){
        this.playerService = playerService;
    }

    @GetMapping
    public Iterable<Player> getAllPlayers(){
        return playerService.getAllPlayers();
    }

    @GetMapping(path = "/{name}")
    public Optional<Player> getPlayer(@PathVariable("name") String name){
        return playerService.getPlayerByName(name);
    }

    @PostMapping
    public Player createPlayer(@RequestBody Player player){
        return playerService.createPlayer(player);
    }

    @DeleteMapping
    public void deletePlayer(@RequestBody Player player){
        playerService.deletePlayer(player);
    }
}
