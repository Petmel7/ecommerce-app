import React from 'react';

const ProductCard = ({ product }) => (
    <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Ціна: {product.price} грн</p>
    </div>
);

export default ProductCard;
