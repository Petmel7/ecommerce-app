import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav>
        <Link to="/">Головна</Link>
        <Link to="/profile">Профіль</Link>
        <Link to="/add-product">Додати товар</Link>
        <Link to="/orders">Мої замовлення</Link>
    </nav>
);

export default Navbar;
