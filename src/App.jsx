import React, { useState } from 'react';
import './App.css';
import LogInPage from './pages/LogInPage/LogIn';
import Register from './pages/RegisterPage/Register';
import HomePage from './pages/HomePage/HomePage';
import ArticleDetails from './pages/ArticleDetailsPage/ArticleDetails';
import Profile from './pages/ProfilePage/Profile';
import AboutUsPage from './pages/AboutUsPage/AboutUs';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  const [category, setCategory] = useState('all');

  return (
    <AuthProvider> 
      <Router>
        <Navbar setCategory={setCategory} />
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage category={category} />} />
          <Route path="/article/:id" element={<ArticleDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about-us" element={<AboutUsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
