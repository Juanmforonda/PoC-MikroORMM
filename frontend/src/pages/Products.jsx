import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  actualizarStockMasivo,
} from '../api/products.js';
import { getCategories } from '../api/categories.js';
import { getTags } from '../api/tags.js';

export function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    categoryId: '',
    tagIds: [],
  });
  const [filter, setFilter] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filter === 'in') params.inStock = 'true';
      if (filter === 'out') params.inStock = 'false';
      if (filterCategory) params.categoryId = filterCategory;
      if (filterMin) params.minPrice = filterMin;
      if (filterMax) params.maxPrice = filterMax;

      const data = await getProducts(params);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error al cargar productos'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filter, filterCategory, filterMin, filterMax]);

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description?.trim() || undefined,
        stock: form.stock !== '' ? parseInt(form.stock, 10) : 0,
        categoryId: form.categoryId ? parseInt(form.categoryId, 10) : undefined,
        tagIds: form.tagIds,
      });
      setForm({
        name: '',
        price: '',
        description: '',
        stock: '',
        categoryId: '',
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      stock: product.stock || 0,
      categoryId: product.category?.id || '',
      tagIds: product.tags?.map((t) => t.id) || [],
    });
  };

  const saveEdit = async () => {
    try {
      await updateProduct(editingProduct.id, {
        name: editForm.name.trim(),
        price: parseFloat(editForm.price),
        description: editForm.description.trim() || undefined,
        stock: parseInt(editForm.stock, 10) || 0,
        categoryId: editForm.categoryId
          ? parseInt(editForm.categoryId, 10)
          : undefined,
        tagIds: editForm.tagIds,
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleStockMasivo = async () => {
    const incremento = prompt(
      '¿Cuánto stock agregar a productos con stock bajo (<10)?',
      '50'
    );
    if (!incremento || isNaN(incremento)) return;

    setLoading(true);
    try {
      const result = await actualizarStockMasivo(parseInt(incremento));
      alert(
        ` ${result.message}\n Productos actualizados: ${result.productosActualizados}\n Tiempo: ${result.tiempoEjecucion}`
      );
      fetchProducts(); // Recargar la lista
    } catch (err) {
      alert(` Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilter('all');
    setFilterCategory('');
    setFilterMin('');
    setFilterMax('');
  };

  return (
    <div className="container">
      <h1>Productos</h1>

      <button
        className="btn btn-primary"
        onClick={() => setShowForm((s) => !s)}
      >
        ➕ Agregar producto
      </button>

      <button
        className="btn btn-warning"
        onClick={handleStockMasivo}
        disabled={loading}
        title="Actualiza el stock de productos con menos de 10 unidades"
      >
         Stock Masivo
      </button>

      <p style={{ fontSize: '12px', color: '#6c757d', margin: '5px 0' }}>

      </p>

      {/* Filtros */}
      <div className="filters">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Precio Min"
          value={filterMin}
          onChange={(e) => setFilterMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio Max"
          value={filterMax}
          onChange={(e) => setFilterMax(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="in">En stock</option>
          <option value="out">Sin stock</option>
        </select>
        <button className="btn btn-secondary" onClick={clearFilters}>
          Limpiar
        </button>
      </div>

      {/* Formulario alta */}
      {showForm && (
        <form onSubmit={handleAdd}>
          <input
            placeholder="Nombre *"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <input
            placeholder="Precio *"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
          <input
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
          />
          <input
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <select
            value={form.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div>
            <label style={{ marginRight: '8px' }}>Tags:</label>
            {tags.map((t) => (
              <label key={t.id} style={{ marginRight: '10px' }}>
                <input
                  type="checkbox"
                  checked={form.tagIds.includes(t.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((s) => ({ ...s, tagIds: [...s.tagIds, t.id] }));
                    } else {
                      setForm((s) => ({
                        ...s,
                        tagIds: s.tagIds.filter((id) => id !== t.id),
                      }));
                    }
                  }}
                />
                {t.name}
              </label>
            ))}
          </div>

          {/* 👇 el botón queda en otra línea */}
          <div style={{ marginTop: '10px' }}>
            <button type="submit" className="btn btn-success">
              Agregar
            </button>
          </div>
        </form>
      )}

      {/* Tabla de productos */}
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Tags</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description || '—'}</td>
              <td>${p.price.toFixed(2)}</td>
              <td style={{ color: p.stock > 0 ? 'green' : 'red' }}>
                {p.stock}
              </td>
              <td>{p.category?.name || 'Sin categoría'}</td>
              <td>{p.tags?.map((t) => t.name).join(', ') || '—'}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => openEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal edición */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar producto</h2>
            <label>
              Nombre
              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </label>
            <label>
              Precio
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
              />
            </label>
            <label>
              Descripción
              <input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, stock: e.target.value })
                }
              />
            </label>
            <label>
              Categoría
              <select
                value={editForm.categoryId || ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label>Tags:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.map((t) => (
                  <label key={t.id}>
                    <input
                      type="checkbox"
                      checked={editForm.tagIds.includes(t.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditForm((s) => ({
                            ...s,
                            tagIds: [...s.tagIds, t.id],
                          }));
                        } else {
                          setEditForm((s) => ({
                            ...s,
                            tagIds: s.tagIds.filter((id) => id !== t.id),
                          }));
                        }
                      }}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </label>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-success" onClick={saveEdit}>
                 Guardar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setEditingProduct(null)}
              >
                 Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
