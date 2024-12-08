import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ closeModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    closeModal(); 
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="wrapper">
            <div className="container main">
              <div className="row">
                <div className="col-md-6 side-image">
                  
                 
                </div>


                <div className="col-md-6 right">
                  <div className="input-box">
                    <header>Login</header>
                    <form onSubmit={handleSubmit}>
                      <div className="input-field">
                        <input
                          type="email"
                          className="input"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                      <div className="input-field">
                        <input
                          type="password"
                          className="input"
                          id="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                      <div className="input-field">
                        <input type="submit" className="submit" value="Login" />
                      </div>
                      <div className="signin">
                        <span>
                          Don’t have an account? <a href="/register">Sign up here</a>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button className="btn-close" onClick={closeModal}></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
