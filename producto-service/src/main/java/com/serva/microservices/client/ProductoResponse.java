package com.serva.microservices.client;

import com.serva.microservices.dto.Categoria;
import com.serva.microservices.model.Producto;
import lombok.Data;

@Data
public class ProductoResponse {
    private Producto producto;
    private Categoria categoria;
}
