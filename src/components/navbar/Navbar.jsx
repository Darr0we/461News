import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LoginModal from '../modals/LoginModal';


function Navbar({ setCategory }) {
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5001/topics');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            setShowModal(true);
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowModal(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                {/* Left Side: Links */}
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button className="nav-link btn btn-link" onClick={() => setCategory('all')}>
                            Home
                        </button>
                    </li>
                    <li className="nav-item">
                        <Link to="/about-us" className="nav-link">
                            About Us
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link" onClick={handleProfileClick}>
                            Profile
                        </button>
                    </li>
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="categoryDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Category
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category.topic_id}>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setCategory(category.name)}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span className="dropdown-item disabled">
                                        Loading categories...
                                    </span>
                                </li>
                            )}
                        </ul>
                    </li>
                </ul>

                {/* Right Side: Login Button */}
                {!isLoggedIn ? (
                    <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
                        Login
                    </button>
                ) : (
                    <span className="navbar-text">Welcome back!</span>
                )}
            </div>

            {/* Conditionally Render LoginModal */}
            {showModal && <LoginModal closeModal={handleLogin} />}
        </nav>
    );
}

export default Navbar;
