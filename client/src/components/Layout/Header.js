import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <header>
        <h1>Комісійний Магазин</h1>
        <nav>
            <Link to="/">Головна</Link>
            <Link to="/login">Логін</Link>
            <Link to="/register">Реєстрація</Link>
        </nav>
    </header>
);

export default Header;
