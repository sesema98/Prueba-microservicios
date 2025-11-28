import { useEffect, useMemo, useState } from 'react';
import api from './services/api';
import './App.css';

const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '-';
  }
  return currencyFormatter.format(Number(value));
};

const initialCategoriaForm = { nombre: '' };
const initialProductoForm = { nombre: '', precio: '', categoriaId: '' };

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [categoriaForm, setCategoriaForm] = useState(initialCategoriaForm);
  const [productoForm, setProductoForm] = useState(initialProductoForm);
  const [categoriaErrors, setCategoriaErrors] = useState({});
  const [productoErrors, setProductoErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const categoriasById = useMemo(() => {
    const map = new Map();
    categorias.forEach((categoria) => {
      map.set(categoria.id, categoria.nombre);
    });
    return map;
  }, [categorias]);

  const loadData = async () => {
    setLoading(true);
    setGlobalError('');
    setFeedback('');
    try {
      const [categoriasResponse, productosResponse] = await Promise.all([
        api.fetchCategorias(),
        api.fetchProductos(),
      ]);
      setCategorias(categoriasResponse ?? []);
      setProductos(productosResponse ?? []);
    } catch (error) {
      setGlobalError(error.message ?? 'No se pudo cargar la información inicial.');
    } finally {
      setLoading(false);
    }
  };

  const refreshCategorias = async () => {
    try {
      const data = await api.fetchCategorias();
      setCategorias(data ?? []);
    } catch (error) {
      setGlobalError(error.message ?? 'No se pudo actualizar la lista de categorías.');
    }
  };

  const refreshProductos = async () => {
    try {
      const data = await api.fetchProductos();
      setProductos(data ?? []);
    } catch (error) {
      setGlobalError(error.message ?? 'No se pudo actualizar la lista de productos.');
    }
  };

  const handleCategoriaChange = (event) => {
    setCategoriaForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleProductoChange = (event) => {
    setProductoForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCategoriaSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    const errors = {};

    if (!categoriaForm.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio.';
    }

    setCategoriaErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await api.createCategoria({
        nombre: categoriaForm.nombre.trim(),
      });
      setCategoriaForm(initialCategoriaForm);
      setGlobalError('');
      await refreshCategorias();
      setFeedback('Categoría registrada correctamente.');
    } catch (error) {
      setGlobalError(error.message ?? 'No se pudo registrar la categoría.');
    }
  };

  const handleProductoSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');

    const errors = {};
    const nombre = productoForm.nombre.trim();
    const precio = Number(productoForm.precio);
    const categoriaId = Number(productoForm.categoriaId);

    if (!nombre) {
      errors.nombre = 'El nombre es obligatorio.';
    }
    if (!productoForm.precio || Number.isNaN(precio) || precio <= 0) {
      errors.precio = 'El precio debe ser mayor a 0.';
    }
    if (!productoForm.categoriaId || Number.isNaN(categoriaId) || categoriaId <= 0) {
      errors.categoriaId = 'Seleccione una categoría válida.';
    }

    setProductoErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await api.createProducto({
        nombre,
        precio,
        categoriaId,
      });
      setProductoForm(initialProductoForm);
      setGlobalError('');
      await refreshProductos();
      setFeedback('Producto registrado correctamente.');
    } catch (error) {
      setGlobalError(error.message ?? 'No se pudo registrar el producto.');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Gestión de Productos y Categorías</h1>
        <p>
          Consumo de microservicios a través del API Gateway
        </p>
        <div className="actions">
          <button type="button" onClick={loadData}>
            Recargar todo
          </button>
        </div>
      </header>

      {globalError && <div className="alert error">{globalError}</div>}
      {feedback && <div className="alert success">{feedback}</div>}

      {loading ? (
        <div className="panel">
          <p className="muted">Cargando información...</p>
        </div>
      ) : (
        <>
          <section className="grid">
            <div className="card">
              <h2>Registrar Categoría</h2>
              <form onSubmit={handleCategoriaSubmit} noValidate>
                <label htmlFor="categoria-nombre">Nombre</label>
                <input
                  id="categoria-nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej. Tecnología"
                  value={categoriaForm.nombre}
                  onChange={handleCategoriaChange}
                />
                {categoriaErrors.nombre && (
                  <p className="field-error">{categoriaErrors.nombre}</p>
                )}
                <button type="submit">Guardar categoría</button>
              </form>
            </div>

            <div className="card">
              <h2>Registrar Producto</h2>
              <form onSubmit={handleProductoSubmit} noValidate>
                <label htmlFor="producto-nombre">Nombre</label>
                <input
                  id="producto-nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej. Laptop Gamer"
                  value={productoForm.nombre}
                  onChange={handleProductoChange}
                />
                {productoErrors.nombre && (
                  <p className="field-error">{productoErrors.nombre}</p>
                )}

                <label htmlFor="producto-precio">Precio</label>
                <input
                  id="producto-precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={productoForm.precio}
                  onChange={handleProductoChange}
                />
                {productoErrors.precio && (
                  <p className="field-error">{productoErrors.precio}</p>
                )}

                <label htmlFor="producto-categoria">Categoría</label>
                <select
                  id="producto-categoria"
                  name="categoriaId"
                  value={productoForm.categoriaId}
                  onChange={handleProductoChange}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {productoErrors.categoriaId && (
                  <p className="field-error">{productoErrors.categoriaId}</p>
                )}

                <button type="submit">Guardar producto</button>
              </form>
            </div>
          </section>

          <section className="grid">
            <div className="panel">
              <div className="panel-header">
                <h2>Categorías registradas</h2>
                <button type="button" onClick={refreshCategorias}>
                  Actualizar
                </button>
              </div>
              {categorias.length === 0 ? (
                <p className="muted">No hay categorías registradas.</p>
              ) : (
                <ul className="list">
                  {categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <div className="list-title">{categoria.nombre}</div>
                      <span className="muted">ID: {categoria.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2>Productos registrados</h2>
                <button type="button" onClick={refreshProductos}>
                  Actualizar
                </button>
              </div>
              {productos.length === 0 ? (
                <p className="muted">No hay productos registrados.</p>
              ) : (
                <ul className="list">
                  {productos.map((producto) => (
                    <li key={producto.id}>
                      <div className="list-title">
                        {producto.nombre}
                      </div>
                      <div className="muted">
                        Precio: {formatCurrency(producto.precio)}
                      </div>
                      <div className="muted">
                        Categoría:{' '}
                        {categoriasById.get(producto.categoriaId) ?? 'Sin asignar'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
