import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories.js";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("El nombre es obligatorio");
    try {
      await createCategory({
        name: form.name.trim(),
        description: form.description.trim() || "",
      });
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setEditForm({ name: cat.name, description: cat.description || "" });
  };

  const saveEdit = async () => {
    try {
      await updateCategory(editingCategory.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || "",
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container">
      <h1>Categorías</h1>

      <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
        ➕ Agregar categoría
      </button>

      {showForm && (
        <form onSubmit={handleAdd}>
          <input
            placeholder="Nombre *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="btn btn-success">Agregar</button>
        </form>
      )}

      {loading ? (
        <div>Cargando categorías...</div>
      ) : categories.length > 0 ? (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.description || "—"}</td>
                <td>
                  <button className="btn btn-warning btn-xs" onClick={() => openEdit(c)}>Editar</button>
                  <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No hay categorías disponibles.</div>
      )}

      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar categoría</h2>
            <label>Nombre<input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></label>
            <label>Descripción<input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></label>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-success" onClick={saveEdit}>💾 Guardar</button>
              <button className="btn btn-danger" onClick={() => setEditingCategory(null)}> Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
