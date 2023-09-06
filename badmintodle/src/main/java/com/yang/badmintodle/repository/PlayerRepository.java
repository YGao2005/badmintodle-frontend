package com.yang.badmintodle.repository;

import com.yang.badmintodle.model.Player;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends CrudRepository<Player, String> {
    List<Player> findAllByName(String name);
}
