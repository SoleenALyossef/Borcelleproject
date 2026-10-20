import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CartItemsList, CheckoutSummary, FeaturesBanner, SavedForLater, PromoBanner } from './Component';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import { API_Config } from '../../Config/API-Config';
import { useCart } from '../../context/CartContext';

const Mycart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    savedItems,
    loading,
    fetchCartItems,
    fetchFavorites,
    updateQuantity,
    deleteItem,
    removeAllItems,
    addToFavorite,
    removeFromFavorite,
  } = useCart();

  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const BASE_URL =
    API_Config?.BASE_URL || 'https://training.tamkeen-dev.com/tamkeenstore/public/api';

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    fetchCartItems(false);
    fetchFavorites();
  }, []);

  const handleUpdateQty = (cartId, newQty) => {
    if (newQty < 1) return;
    const item = cartItems.find((i) => i.id === cartId);
    const productId = item?.product_id || item?.product?.id;
    if (!productId) return;

    const currentQty = item.quantity || 1;
    const delta = newQty - currentQty;
    updateQuantity(productId, currentQty, delta);
  };

  const handleRemoveItem = (cartId) => {
    deleteItem(cartId);
  };

  const handleRemoveAll = () => {
    removeAllItems();
  };

  const handleSaveForLater = (cartItem) => {
    const productId = cartItem.product_id || cartItem.product?.id || cartItem.id;
    addToFavorite(productId)
      .then(() => deleteItem(cartItem.id))
      .catch(() => alert('Please log in to save items'));
  };

  const handleMoveToCart = (favItem) => {
    const productId = favItem.product_id || favItem.product?.id || favItem.id;

    fetch(`${BASE_URL}/${API_Config?.ENDPOINTS?.CART || 'cart'}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
      .then((res) => res.json())
      .then(() => removeFromFavorite(productId))
      .then(() => {
        fetchCartItems(true);
        fetchFavorites();
      })
      .catch((err) => {
        console.error('Error moving to cart:', err);
      });
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product?.price || item.price || 0);
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const handleApplyCoupon = (code) => {
    const cleanCode = code.trim().toLowerCase();
    if (cleanCode === 'may26') {
      const calculatedDiscount = subtotal * 0.2;
      setDiscountAmount(calculatedDiscount);
      setIsCouponApplied(true);
    } else if (cleanCode === '') {
      alert('Please enter a coupon code.');
    } else {
      setIsCouponApplied(false);
      setDiscountAmount(0);
      alert('Invalid coupon code. Try "may26".');
    }
  };

  const handleCheckout = () => {
  
    navigate('/CheckoutPage');
  };

  const tax = subtotal > 0 ? 14.0 : 0.0;

  return (
    <>
      <MainNavbar />
      <div className="main-cart-wrapper">
        <h2 className="cart-header-title">My cart ({cartItems.length})</h2>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <div className="cart-layout">
          <CartItemsList
            items={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemoveItem}
            onSaveForLater={handleSaveForLater}
            onBackToShop={() => navigate('/')}
            onRemoveAll={handleRemoveAll}
          />

          <CheckoutSummary
            subtotal={subtotal}
            discount={discountAmount}
            tax={tax}
            loading={loading || localLoading}
            isCouponApplied={isCouponApplied}
            onCheckout={handleCheckout}
            onApplyCoupon={handleApplyCoupon}
          />
        </div>

        <FeaturesBanner />

        <SavedForLater savedItems={savedItems} onMoveToCart={handleMoveToCart} />

        <PromoBanner />
      </div>
      <Footer />
    </>
  );
};

export default Mycart;