import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Products } from "./pages/Products.jsx";
import { Categories } from "./pages/Categories.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Tags } from "./pages/Tags.jsx";

export function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/categories">Categorías</Link>
        <Link to="/tags">Tags</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/tags" element={<Tags />} />s
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
