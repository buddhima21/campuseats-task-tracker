import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import MenuList from "../components/MenuLists";
import useFetch from "../hooks/useFetch";

const MenuPage = () => {
  const { data: dishes, isLoading, error } = useFetch("/menu.json");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const debounced = useDebounce(query, 400);

  if (isLoading) return <div className="state-card"><span className="loading-dot" /><p>Preparing the menu...</p></div>;
  if (error) return <div className="state-card"><h2>We couldn&apos;t load the menu</h2><p>{error}</p></div>;

  const categories = ["All", ...new Set(dishes.map((dish) => dish.category))];
  const filtered = dishes.filter((dish) => {
    const matchesQuery = dish.name.toLowerCase().includes(debounced.toLowerCase());
    return matchesQuery && (category === "All" || dish.category === category);
  });

  return (
    <div className="page-content">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">Today&apos;s campus table</p>
          <h1>Good food.<br /><em>Good energy.</em></h1>
          <p className="hero-description">Thoughtfully made favourites to keep you going between lectures.</p>
          <div className="hero-meta">
            <span><b className="status-dot" /> Kitchen is open</span>
            <span>⏱ Ready in 10–20 min</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-sun" />
          <span className="art-plate">☼</span>
          <span className="art-leaf leaf-one">⌁</span>
          <span className="art-leaf leaf-two">⌁</span>
        </div>
      </section>

      <section className="menu-heading">
        <div>
          <p className="eyebrow">Curated for you</p>
          <h2>What are you craving?</h2>
        </div>
        <label className="search-box">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the menu" aria-label="Search the menu" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
        </label>
      </section>

      <div className="category-list" aria-label="Filter by category">
        {categories.map((item) => (
          <button className={category === item ? "category-chip active" : "category-chip"} key={item} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <MenuList dishes={filtered} />
    </div>
  );
};

export default MenuPage;
