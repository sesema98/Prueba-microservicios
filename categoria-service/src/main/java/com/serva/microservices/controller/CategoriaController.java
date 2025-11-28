package com.serva.microservices.controller;


import com.serva.microservices.model.Categoria;
import com.serva.microservices.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)); // si no existe -> 404
    }

    // --------------------------------
    // CREAR CATEGORÍA
    // --------------------------------
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria nueva = repository.save(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    // --------------------------------
    // ACTUALIZAR CATEGORÍA
    // --------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @RequestBody Categoria categoria) {
        return repository.findById(id)
                .map(existing -> {
                    categoria.setId(existing.getId());
                    Categoria actualizada = repository.save(categoria);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // --------------------------------
    // ELIMINAR CATEGORÍA
    // --------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
