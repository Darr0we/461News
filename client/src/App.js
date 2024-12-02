import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import ArticleDetails from './pages/ArticleDetails';
import Profile from './pages/Profile';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [category, setCategory] = useState('all');

    return (
        <Router>
            <div className="App">
                <Navbar setCategory={setCategory} />
                <Routes>
                    <Route path="/" element={<Homepage category={category} />} />
                    <Route path="/article/:id" element={<ArticleDetails />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

