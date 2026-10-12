import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const DishDetailPage = () => {
  const { id } = useParams();
  const { data: dish, isLoading, error } = useFetch(`/menu/${id}`);

  if (isLoading) return <div className="state-card"><span className="loading-dot" /><p>Loading dish details...</p></div>;
  if (error || !dish) return <div className="state-card"><h2>Dish not found</h2><Link className="button" to="/">Back to menu</Link></div>;

  return (
    <div className="detail-page">
      <Link className="back-link" to="/">← Back to menu</Link>
      <div className="detail-card">
        <div className={`detail-art category-${dish.category.toLowerCase()}`}><span>{dish.category === "Drinks" ? "◒" : "●"}</span></div>
        <div className="detail-copy">
          <p className="eyebrow">{dish.category}</p>
          <h1>{dish.name}</h1>
          <p className="detail-description">A comforting campus favourite, prepared fresh in our kitchen and made for a satisfying break in your day.</p>
          <div className="detail-price">Rs. {dish.price}</div>
          <div className="availability"><span className={dish.available ? "status-dot" : "status-dot muted"} /> {dish.available ? "Available today" : "Currently unavailable"}</div>
          <Link className={`button ${!dish.available ? "disabled" : ""}`} to={dish.available ? "/order" : "/"}>{dish.available ? "Order this dish ↗" : "Explore other dishes"}</Link>
        </div>
      </div>
    </div>
  );
};

export default DishDetailPage;
