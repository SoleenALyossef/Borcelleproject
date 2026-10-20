import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({
        name: localStorage.getItem('userName') || 'User',
        image: localStorage.getItem('userImage') || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      });
    }
  }, []);

  const categories = [
    { id: 1, name: "Automobiles", isActive: true },
    { id: 2, name: "Clothes and wear", isActive: false },
    { id: 3, name: "Home interiors", isActive: false },
    { id: 4, name: "Computer and tech", isActive: false },
    { id: 5, name: "Tools, equipments", isActive: false },
    { id: 6, name: "Sports and outdoor", isActive: false },
    { id: 7, name: "Animal and pets", isActive: false },
    { id: 8, name: "Machinery tools", isActive: false },
    { id: 9, name: "More category", isActive: false },
  ];

  return (
    <div className="hero-wrapper">
      {/* 1. العمود الأيسر: قائمة التصنيفات */}
      <div className="hero-sidebar">
        <ul className="hero-category-list">
          {categories.map((category) => (
            <li key={category.id} className={`category-item ${category.isActive ? 'active' : ''}`}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. العمود الأوسط: البانر الرئيسي */}
      <div className="hero-main-banner">
        <span className="banner-subtitle">Latest trending</span>
        <h2 className="banner-title">Electronic items</h2>
        <button className="btn-learn-more" onClick={() => navigate('/ProductListing')}>
          Learn more
        </button>
      </div>

      {/* 3. العمود الأيمن: اللوحات الجانبية */}
      <div className="hero-right-panels">
        <div className="user-panel">
          <div className="user-info">
            <img
              src={user?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-greeting">
              {user ? (
                <>Welcome back,<br /><strong>{user.name}</strong></>
              ) : (
                <>Hi, user<br />let's get started</>
              )}
            </div>
          </div>
          
          {!user && (
            <>
              <button className="btn-join" onClick={() => navigate('/LoginPage')}>Join now</button>
              <button className="btn-login" onClick={() => navigate('/LoginPage')}>Log in</button>
            </>
          )}
        </div>

        <div className="promo-panel promo-orange">
          Get US $10 off <br /> with a new <br /> supplier
        </div>

        <div className="promo-panel promo-pink">
          Send quotes with <br /> supplier <br /> preferences
        </div>
      </div>
    </div>
  );
};

export default HeroSection;