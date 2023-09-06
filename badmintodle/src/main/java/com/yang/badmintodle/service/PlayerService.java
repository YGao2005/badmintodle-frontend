package com.yang.badmintodle.service;

import com.yang.badmintodle.repository.PlayerRepository;
import com.yang.badmintodle.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Optional<Player> getPlayerByName(String name) {
        return playerRepository.findAllByName(name)
                .stream()
                .findFirst();
    }

    public Iterable<Player> getAllPlayers(){
        return playerRepository.findAll();
    }

    public Player createPlayer(Player player) {
        String uuid = UUID.randomUUID().toString();
        player.setId(uuid);
        playerRepository.save(player);
        return player;
    }

    public void deletePlayer(Player player){
        playerRepository.delete(player);
    }
}
