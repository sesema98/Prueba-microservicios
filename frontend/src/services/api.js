const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

const buildOptions = (options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  return {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {}),
    },
  };
};

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, buildOptions(options));

  if (!response.ok) {
    let message = `Error ${response.status}`;

    try {
      const data = await response.json();
      if (typeof data === 'string') {
        message = data;
      } else if (data?.message) {
        message = data.message;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

const api = {
  fetchCategorias: () => request('/api/categorias'),
  createCategoria: (categoria) =>
    request('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(categoria),
    }),
  fetchProductos: () => request('/api/productos'),
  createProducto: (producto) =>
    request('/api/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    }),
};

export default api;
