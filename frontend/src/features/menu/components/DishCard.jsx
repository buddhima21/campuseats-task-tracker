import { Link } from "react-router-dom";

const DishCard = ({ dish }) => (
  <article className={`dish-card ${!dish.available ? "unavailable" : ""}`}>
    <div className={`dish-art category-${dish.category.toLowerCase()}`} aria-hidden="true">
      <span>{dish.category === "Drinks" ? "◒" : dish.category === "Dessert" ? "✦" : "●"}</span>
      {!dish.available && <small>Sold out</small>}
    </div>
    <div className="dish-info">
      <div className="dish-title-row">
        <div>
          <p className="dish-category">{dish.category}</p>
          <h3>{dish.name}</h3>
        </div>
        <strong className="price">Rs. {dish.price}</strong>
      </div>
      <Link className="card-link" to={`/dish/${dish.id}`}>{dish.available ? "View dish" : "View details"} <span>↗</span></Link>
    </div>
  </article>
);

export default DishCard;
