package com.serva.microservices.service;

import com.serva.microservices.client.CategoriaClient;
import com.serva.microservices.client.ProductoResponse;
import com.serva.microservices.model.Producto;
import com.serva.microservices.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository repository;
    private final CategoriaClient categoriaClient;

    public ProductoService(ProductoRepository repository, CategoriaClient categoriaClient) {
        this.repository = repository;
        this.categoriaClient = categoriaClient;
    }

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Optional<Producto> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public Producto crear(Producto producto) {
        return repository.save(producto);
    }

    public Optional<Producto> actualizar(Long id, Producto producto) {
        return repository.findById(id)
                .map(actual -> {
                    actual.setNombre(producto.getNombre());
                    actual.setPrecio(producto.getPrecio());
                    actual.setCategoriaId(producto.getCategoriaId());
                    return repository.save(actual);
                });
    }

    public boolean eliminar(Long id) {
        return repository.findById(id)
                .map(prod -> {
                    repository.delete(prod);
                    return true;
                })
                .orElse(false);
    }

    public Optional<ProductoResponse> obtenerDetalle(Long id) {
        return repository.findById(id)
                .map(prod -> {
                    ProductoResponse response = new ProductoResponse();
                    response.setProducto(prod);
                    if (prod.getCategoriaId() != null) {
                        response.setCategoria(categoriaClient.obtenerCategoria(prod.getCategoriaId()));
                    }
                    return response;
                });
    }
}
