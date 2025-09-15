// src/pages/Tags.jsx
import { useEffect, useState } from "react";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../api/tags.js";

export function Tags() {
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingTag, setEditingTag] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const fetchTags = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al cargar tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("El nombre es obligatorio");
    try {
      await createTag({
        name: form.name.trim(),
        description: form.description.trim() || "",
      });
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchTags();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const openEdit = (tag) => {
    setEditingTag(tag);
    setEditForm({ name: tag.name, description: tag.description || "" });
  };

  const saveEdit = async () => {
    try {
      await updateTag(editingTag.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || "",
      });
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar tag?")) return;
    try {
      await deleteTag(id);
      fetchTags();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container">
      <h1>Tags</h1>

      <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
        ➕ Agregar tag
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
        <div>Cargando tags...</div>
      ) : tags.length > 0 ? (
        <table className="tag-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "250px" }}>
                {t.description || "—"}
                </td>
                <td>
                  <button className="btn btn-warning btn-xs" onClick={() => openEdit(t)}>Editar</button>
                  <button className="btn btn-danger btn-xs" onClick={() => handleDelete(t.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No hay tags disponibles.</div>
      )}

      {editingTag && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar tag</h2>
            <label>Nombre<input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></label>
            <label>Descripción<input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></label>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-success" onClick={saveEdit}>💾 Guardar</button>
              <button className="btn btn-danger" onClick={() => setEditingTag(null)}> Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
