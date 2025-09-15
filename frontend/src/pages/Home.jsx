export function Home() {
  return (
    <div className="container">
      <h1>Sistema de Gestión</h1>
      <div className="card">
        <div className="card-title">Funcionalidades disponibles</div>
        <p>Usa el menú superior para navegar entre las diferentes secciones:</p>
        <ul>
          <li>
            <strong>Productos</strong> - Gestiona tu inventario
          </li>
          <li>
            <strong>Categorías</strong> - Organiza tus productos
          </li>
          <li>
            <strong>Tags</strong> - Etiqueta y clasifica
          </li>
        </ul>
      </div>

      <div className="card">
        <div className="card-title">Información</div>
        <p>
          Sistema simple para demostrar funcionalidades CRUD con MikroORM.
          Navega por las secciones para probar las operaciones básicas.
        </p>
      </div>
    </div>
  );
}
