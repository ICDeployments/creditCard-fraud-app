import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useLocation } from 'react-router-dom';
import './Navbar.css'; // Add styling here
import CognizantLogo from '../assets/cogni-logo.svg'; 
import Profile from '../assets/profile-pic.png';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="main-navbar">
      <div className="nav-left">
        <div className="logo-placeholder">
          <img src={CognizantLogo} alt='Cognizant Logo' className='logo-img'/>
        </div> 
        <span className="brand-name">Cognizant</span>
      </div>

      <div className="nav-center">
      </div>
      
      <div className="nav-right">
        <div className="admin-info">
          <p className="admin-name">Admin</p>
          <p className="admin-email">admin321@outlook.com</p>
        </div>
        <img 
          src={Profile}
          alt="profile" 
          className="profile-pic" 
        />
      </div>
    </nav>
  );
};

export default Navbar;