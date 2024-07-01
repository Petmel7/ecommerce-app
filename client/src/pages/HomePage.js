import React from 'react';
import ProductList from '../components/Product/ProductList';

const HomePage = () => {
    // Приклад продуктів, які можна отримати з API
    const products = [
        { id: 1, name: 'Товар 1', description: 'Опис товару 1', price: 100, image: 'image1.jpg' },
        { id: 2, name: 'Товар 2', description: 'Опис товару 2', price: 200, image: 'image2.jpg' },
    ];

    return (
        <div>
            <h1>Головна сторінка</h1>
            <ProductList products={products} />
        </div>
    );
};

export default HomePage;
