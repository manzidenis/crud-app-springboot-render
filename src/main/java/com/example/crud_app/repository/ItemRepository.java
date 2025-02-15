package com.example.crud_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crud_app.model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
