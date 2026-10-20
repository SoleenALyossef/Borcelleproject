import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  FiHome,
  FiBox,
  FiTag,
  FiShoppingCart,
  FiBookmark,
  FiMapPin,
  FiMap,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiUser,
  FiGlobe,
} from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './AdminLayout.css';
import logoimg from '../../assets/image/Black and Red Online Store Logo 1.png';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <FiHome />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FiBox /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingCart /> },
  { to: '/admin/brands', label: 'Brands', icon: <FiBookmark /> },
  { to: '/admin/cities', label: 'Cities', icon: <FiMapPin /> },
  { to: '/admin/municipals', label: 'Municipals', icon: <FiMap /> },
];

const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <NavLink to="/" className="admin-brand admin-brand-link" title={i18n.language === 'ar' ? 'العودة إلى المتجر' : 'Back to the storefront'}>
          <img src={logoimg} alt="Borcelle" />
          {!collapsed && <span>{i18n.language === 'ar' ? 'بورسيل' : 'Borcelle'}</span>}
        </NavLink>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-toggle" onClick={() => setCollapsed(!collapsed)}>
            <FiMenu />
          </button>

          <div className="admin-topbar-right">
            <button className="admin-icon-btn" onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')} title={i18n.language === 'ar' ? 'English' : 'العربية'} aria-label="Toggle language">
              <FiGlobe />
            </button>
            <button className="admin-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            <div className="admin-user">
              <FiUser size={18} />
              <span>{adminUser?.email || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;