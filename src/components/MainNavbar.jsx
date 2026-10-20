import { FiMenu } from 'react-icons/fi';
import { Dropdown } from 'react-bootstrap';
import Navbarpayment from '../Pages/PaymentMethod/Navbarpayment';
import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { API_Config } from '../Config/API-Config';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../App.css';

const getCollection = (payload) => {
  const candidates = [
    payload?.data?.data,
    payload?.data?.categories,
    payload?.data,
    payload?.categories,
    payload?.results,
    payload?.items,
    payload,
  ];
  return candidates.find(Array.isArray) || [];
};

const categoryName = (category, language) => language === 'ar'
  ? (category?.ar?.name || category?.name || category?.en?.name || `#${category?.id ?? ''}`)
  : (category?.en?.name || category?.name || category?.ar?.name || `#${category?.id ?? ''}`);

const MainNavbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CATEGORY}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load categories');
        return response.json();
      })
      .then((payload) => setCategories(getCollection(payload)))
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Navbar categories error:', error);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setIsNavVisible(!(window.scrollY > lastScrollY && window.scrollY > 100));
      lastScrollY = window.scrollY;
    };
    const handleMouseMove = (event) => {
      if (event.clientY <= 60) setIsNavVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const openCategory = (categoryId) => {
    const query = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : '';
    navigate(`/ProductListing${query}`);
  };

  return (
    <header className={`main-header-wrapper ${!isNavVisible ? 'nav-hidden' : ''}`}>
      <Navbarpayment />
      <div className="sub-navbar d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <Dropdown>
            <Dropdown.Toggle
              as="button"
              type="button"
              id="all-categories-dropdown"
              className="sub-nav-link fw-semibold sub-nav-category-toggle"
            >
              <FiMenu size={18} />
              {t('navbar.allCategory')}
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-sm category-navigation-menu">
              <Dropdown.Item onClick={() => openCategory(null)}>{t('navbar.allCategory')}</Dropdown.Item>
              <Dropdown.Divider />
              {categories.map((category) => (
                <Dropdown.Item
                  key={category.id}
                  onClick={() => openCategory(category.id)}
                >
                  {categoryName(category, i18n.language)}
                </Dropdown.Item>
              ))}
              {categories.length === 0 && (
                <Dropdown.Item onClick={() => navigate('/ProductListing')}>
                  {t('navbar.products')}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <NavLink className="sub-nav-link" to="/ProductListing">
            {t('navbar.products')}
          </NavLink>
          {isAdminAuthenticated && (
            <NavLink className="sub-nav-link" to="/admin">
              {i18n.language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
