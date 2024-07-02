
import React from 'react';

const baseUrl = 'http://localhost:5000/';

const ProductCard = ({ product }) => (
    <div className="product-card">
        <img src={`${baseUrl}${product.image}`} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Ціна: {product.price} грн</p>
    </div>
);

export default ProductCard;
