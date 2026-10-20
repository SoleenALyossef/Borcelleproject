import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LoginPage from './Pages/login/LoginPage';
import Verification from './Pages/login/Verification';
import ProfileInfoPage from './Pages/login/ProfileInfoPage';
import CheckoutPage from './Pages/PaymentMethod/CheckoutPage';
import ProfilePage from './Pages/Profile/ProfilePage';
import TermsPage from './Pages/Profile/TermsPage';
import ContactPage from './Pages/Profile/ContactPage';
import HomePage from './Pages/Home/HomePage';
import ProductListing from './Pages/Products/ProductListing';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import RelatedAndDiscount from './Pages/ProductDetails/RelatedAndDiscount';
import Mycart from './Pages/Cart/Mycart';
import FavoritesPage from './Pages/Favorites/FavoritesPage';
import OrdersPage from './Pages/Orders/OrdersPage';
import './App.css';

import AdminLogin from './Pages/Admin/AdminLogin';
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProductsList from './Pages/Admin/Products/ProductsList';
import ProductForm from './Pages/Admin/Products/ProductForm';
import CategoriesList from './Pages/Admin/Categories/CategoriesList';
import CategoryForm from './Pages/Admin/Categories/CategoryForm';
import OrdersList from './Pages/Admin/Orders/OrdersList';
import OrderDetails from './Pages/Admin/Orders/OrderDetails';
import BrandsList from './Pages/Admin/Brands/BrandsList';
import CitiesList from './Pages/Admin/Cities/CitiesList';
import MunicipalsList from './Pages/Admin/Municipals/MunicipalsList';
import { useAdminAuth } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 1. حماية الأدمن
const RequireAdmin = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

//  2. حماية المستخدم العادي (Customer)
const RequireAuth = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

// A fresh browser with no session should start at the home page, not at a pasted deep link.
// Actual private data is still protected by RequireAuth and server-side token validation.
const InitialDeepLinkGuard = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const normalizedPath = path.toLowerCase();
  const isAuthRoute = ['/loginpage', '/verification', '/admin/login'].includes(normalizedPath);
  const isAdminRoute = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');
  const hasCustomerSession = Boolean(localStorage.getItem('token'));
  const hasAdminSession = Boolean(localStorage.getItem('adminToken'));
  const hasRouteSession = isAdminRoute ? hasAdminSession : (hasCustomerSession || hasAdminSession);
  const entryEstablished = sessionStorage.getItem('borcelle-entry-established') === '1';
  const isCustomerPrivateRoute = ['/profilepage', '/profileinfopage', '/orders', '/checkoutpage'].includes(normalizedPath);

  useEffect(() => {
    if (path === '/' || isAuthRoute || hasRouteSession) {
      sessionStorage.setItem('borcelle-entry-established', '1');
    }
  }, [path, isAuthRoute, hasRouteSession]);

  // A pasted deep link in a new tab/session must never restore a private view directly.
  // The visitor can navigate normally from Home; account APIs still validate the token.
  if (path !== '/' && !isAuthRoute && !entryEstablished) {
    const attemptedPath = `${location.pathname}${location.search || ''}${location.hash || ''}`;
    return (
      <Navigate
        to="/"
        replace
        state={isCustomerPrivateRoute ? { authRequired: true, attemptedPath } : null}
      />
    );
  }

  return children;
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <InitialDeepLinkGuard>
      <Routes>
        {/* Auth */}
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Verification" element={<Verification />} />
        <Route path="/ProfileInfoPage" element={<ProfileInfoPage />} />

        {/* Main  */}
        <Route path="/" element={<HomePage />} />
        <Route path="/ProductListing" element={<ProductListing />} />
        <Route path="/Mycart" element={<Mycart />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/ProductDetails" element={<ProductDetails />} />
        <Route path="/RelatedAndDiscount" element={<RelatedAndDiscount />} />
        <Route path="/TermsPage" element={<TermsPage />} />
        <Route path="/ContactPage" element={<ContactPage />} />

        {/*  المحمية ( تسجيل دخول) */}
        <Route 
          path="/ProfilePage" 
          element={<RequireAuth><ProfilePage /></RequireAuth>} 
        />
        <Route 
          path="/orders" 
          element={<RequireAuth><OrdersPage /></RequireAuth>} 
        />
       <Route path="/CheckoutPage" element={<RequireAuth><CheckoutPage /></RequireAuth>} />

        {/* 404 */}
        <Route path="*" element={<div className="text-center py-5">Page not found</div>} />
        
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/edit/:id" element={<CategoryForm />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="brands" element={<BrandsList />} />
          <Route path="cities" element={<CitiesList />} />
          <Route path="municipals" element={<MunicipalsList />} />
        </Route>
      </Routes>
      </InitialDeepLinkGuard>
    </BrowserRouter>
  );
}

export default App;