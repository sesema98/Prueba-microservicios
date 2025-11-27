package com.serva.microservices.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Producto {
    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private Double precio;
    private Long CategoriaId;
}
