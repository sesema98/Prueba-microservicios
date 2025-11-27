package com.serva.microservices.controller;


import com.serva.microservices.model.Categoria;
import com.serva.microservices.repository.CategoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    private final CategoriaRepository repository;

    public CategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    // --------------------------------
    // LISTAR TODAS LAS CATEGORÍAS
    // --------------------------------
    @GetMapping
    public List<Categoria> listar() {
        return repository.findAll();
    }

    // --------------------------------
    // BUSCAR CATEGORÍA POR ID
    // --------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok) // si existe -> 200 OK
                .orElse(ResponseEntity.notFound().build()); // si no existe -> 404
    }
}
