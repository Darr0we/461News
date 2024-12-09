import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown'; 
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [topics, setTopics] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Sync `isLoggedIn` with token presence
    }, [setIsLoggedIn]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5001/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser(data);
                setIsLoggedIn(true); // Set as logged in if fetching succeeds
            } catch (error) {
                console.error('Error fetching user data:', error);
                handleLogout(); // Logout if fetching fails
            }
        };

        if (localStorage.getItem('token')) {
            fetchUserData();
        }
    }, [setIsLoggedIn]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch('http://localhost:5001/topics', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch topics');
                }
                const data = await response.json();
                const filteredTopics = data.filter(topic => topic.topic_id >= 1 && topic.topic_id <= 6);
                setTopics(filteredTopics);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, []);

    const handleTopicClick = (topicId) => {
        navigate(`/?topic=${topicId}`); 
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        console.log("Navbar state - Is Logged In:", isLoggedIn, "User:", user);
    }, [isLoggedIn, user]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                {/* Left Side: Links */}
                <ul className="navbar-nav flex-row me-auto mb-2 mb-lg-0">
                    <li className="nav-item me-3">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item me-3">
                        <Link to="/about-us" className="nav-link">About Us</Link>
                    </li>
                    <li className="nav-item me-3">
                        <Link to="/profile" className="nav-link">Profile</Link>
                    </li>
                    <li className="nav-item dropdown me-3">
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">Topics</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {topics.length > 0 ? (
                                    topics.map((topic) => (
                                        <Dropdown.Item
                                            key={topic.topic_id}
                                            onClick={() => handleTopicClick(topic.topic_id)}
                                        >
                                            {topic.name}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>Loading topics...</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>

                {/* Right Side: Login */}
                {!isLoggedIn ? (
                    <Dropdown as={ButtonGroup}>
                        <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
                        <Dropdown.Toggle split variant="primary" id="dropdown-split-basic"/>
                        <Dropdown.Menu>
                            <Dropdown.Item href="/register">Register</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">{user?.username || 'User'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
