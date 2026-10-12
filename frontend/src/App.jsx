import { NavLink, Route, Routes } from "react-router-dom";
import MenuPage from "./features/menu/pages/MenuPage";
import DishDetailPage from "./features/menu/pages/DishDetailPage";
import OrderPage from "./features/menu/pages/OrderPage";

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">
          <span className="brand-mark">✦</span>
          <span>
            <strong>CampusEats</strong>
            <small>Fresh from the campus kitchen</small>
          </span>
        </NavLink>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink end to="/">Menu</NavLink>
          <NavLink to="/order">Place an order <span className="nav-arrow">↗</span></NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="*" element={<div className="state-card"><h1>Page not found</h1><p>Let&apos;s get you back to something delicious.</p><NavLink className="button" to="/">Back to menu</NavLink></div>} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span>Made for busy students, with care.</span>
        <span>Open weekdays · 8:00 — 18:00</span>
      </footer>
    </div>
  );
}

export default App;
