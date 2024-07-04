
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => (
    <ul className="product-list">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
    </ul>
);

export default ProductList;

