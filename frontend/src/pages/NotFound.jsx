export function NotFound() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <div className="card-title">Página no encontrada</div>
        <p>La página que buscas no existe.</p>
        <button
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
