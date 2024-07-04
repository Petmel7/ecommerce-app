
import React from 'react';
import './styles/ProductCard.css';

const baseUrl = 'http://localhost:5000/';

const ProductCard = ({ product }) => (
    <li className="product-card">
        <img className="product-card__image" src={`${baseUrl}${product.image}`} alt={product.name} />
        <h2 className="product-card__name">{product.name}</h2>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">Ціна: {product.price} грн</p>
    </li>
);

export default ProductCard;
