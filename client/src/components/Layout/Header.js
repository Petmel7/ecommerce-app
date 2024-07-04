
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <button className="burger-button" onClick={toggleMenu}>
                ☰
            </button>
            <div className="search-container">
                <input type="text" className="search-input" placeholder="Пошук..." />
                <button className="search-button">🔍</button>
                <button className="cart-button">🛒</button>
            </div>
            <nav className={`header__nav ${isOpen ? 'open' : ''}`}>
                <Link className="header__link" to="/" onClick={toggleMenu}>Головна</Link>
                <Link className="header__link" to="/login" onClick={toggleMenu}>Логін</Link>
                <Link className="header__link" to="/register" onClick={toggleMenu}>Реєстрація</Link>
            </nav>
        </header>
    );
};

export default Header;


