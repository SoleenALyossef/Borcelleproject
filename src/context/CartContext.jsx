import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_Config } from '../Config/API-Config';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  
  //  عدد الطلبات الجديدة (غير المقروءة) - يبدأ من 0 عند التحميل
  const [ordersCount, setOrdersCount] = useState(() => {
    const saved = localStorage.getItem('unreadOrdersCount');
    return saved ? Number(saved) : 0;
  });

  const [loading, setLoading] = useState(false);

  const BASE_URL = API_Config?.BASE_URL;
  const CART_EP = `${BASE_URL}/${API_Config?.ENDPOINTS?.CART || 'cart'}`;
  const FAV_EP = `${BASE_URL}/favorite`;
  const ORDER_EP = `${BASE_URL}/order`;

  const isLoggedIn = () => !!localStorage.getItem('token');

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const calculateCount = (items) =>
    items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // ==================== Guest Helpers ====================
  const loadGuestCart = () => {
    try { return JSON.parse(sessionStorage.getItem('guestCart') || '[]'); }
    catch { return []; }
  };
  const saveGuestCart = (items) => sessionStorage.setItem('guestCart', JSON.stringify(items));

  const loadGuestFavorites = () => {
    try { return JSON.parse(sessionStorage.getItem('guestFavorites') || '[]'); }
    catch { return []; }
  };
  const saveGuestFavorites = (items) => sessionStorage.setItem('guestFavorites', JSON.stringify(items));

  // ==================== Fetch Cart ====================
  const fetchCartItems = useCallback((isSilent = false) => {
    if (!isSilent) setLoading(true);

    if (!isLoggedIn()) {
      const guestItems = loadGuestCart();
      setCartItems(guestItems);
      setCartCount(calculateCount(guestItems));
      setLoading(false);
      return Promise.resolve(guestItems);
    }

    return fetch(CART_EP, { method: 'GET', headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => {
        const items = data?.data?.data || data?.data || data || [];
        const arr = Array.isArray(items) ? items : [];
        setCartItems(arr);
        setCartCount(calculateCount(arr));
        if (!isSilent) setLoading(false);
        return arr;
      })
      .catch((err) => {
        console.error('Cart Fetch Error:', err);
        if (!isSilent) setLoading(false);
      });
  }, [CART_EP]);

  // ==================== Fetch Favorites ====================
  const fetchFavorites = useCallback(() => {
    if (!isLoggedIn()) {
      const guestFavs = loadGuestFavorites();
      setSavedItems(guestFavs);
      setFavoriteCount(guestFavs.length);
      return Promise.resolve(guestFavs);
    }

    return fetch(FAV_EP, { method: 'GET', headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => {
        const items = data?.data?.data || data?.data || data || [];
        const arr = Array.isArray(items) ? items : [];
        setSavedItems(arr);
        setFavoriteCount(arr.length);
        return arr;
      })
      .catch((err) => console.error('Favorites Fetch Error:', err));
  }, [FAV_EP]);

  // ==================== Fetch Orders ====================
  const fetchOrders = useCallback(() => {
    if (!isLoggedIn()) {
      setOrders([]);
      setOrdersCount(0);
      return Promise.resolve([]);
    }

    return fetch(ORDER_EP, { method: 'GET', headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => {
        const items = data?.data?.data || data?.data || data || [];
        const arr = Array.isArray(items) ? items : [];
        setOrders(arr);

        // حساب الطلبات غير المقروءة بناءً على العدد المخزن مسبقاً
        const lastReadCount = Number(localStorage.getItem('lastReadOrdersCount')) || 0;
        const unreadCount = Math.max(0, arr.length - lastReadCount);
        
        setOrdersCount(unreadCount);
        localStorage.setItem('unreadOrdersCount', String(unreadCount));
        localStorage.setItem('totalOrdersCount', String(arr.length));

        return arr;
      })
      .catch((err) => console.error('Orders Fetch Error:', err));
  }, [ORDER_EP]);

  //  دالة تصفير العداد عند دخول صفحة الطلبات
  const markOrdersAsRead = useCallback(() => {
    const totalCount = orders.length || Number(localStorage.getItem('totalOrdersCount')) || 0;
    localStorage.setItem('lastReadOrdersCount', String(totalCount));
    localStorage.setItem('unreadOrdersCount', '0');
    setOrdersCount(0);
  }, [orders.length]);

  // ==================== Cart Actions ====================
  const addToCart = (productId, productData = null, quantity = 1) => {
    if (!isLoggedIn()) {
      const guestItems = loadGuestCart();
      const existing = guestItems.find(
        (it) => String(it.product_id) === String(productId)
      );

      let updated;
      if (existing) {
        updated = guestItems.map((it) =>
          String(it.product_id) === String(productId)
            ? { ...it, quantity: (it.quantity || 1) + quantity }
            : it
        );
      } else {
        updated = [
          ...guestItems,
          { id: `guest_${Date.now()}`, product_id: productId, quantity, product: productData },
        ];
      }

      saveGuestCart(updated);
      setCartItems(updated);
      setCartCount(calculateCount(updated));
      return Promise.resolve(updated);
    }

    return fetch(CART_EP, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    })
      .then((res) => res.json())
      .then(() => fetchCartItems(true))
      .catch((err) => console.error(err));
  };

  const updateQuantity = (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    if (!isLoggedIn()) {
      const guestItems = loadGuestCart();
      const updated = guestItems.map((it) =>
        String(it.product_id) === String(productId)
          ? { ...it, quantity: newQty }
          : it
      );
      saveGuestCart(updated);
      setCartItems(updated);
      setCartCount(calculateCount(updated));
      return Promise.resolve();
    }

    return fetch(CART_EP, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity: newQty }),
    })
      .then((res) => res.json())
      .then(() => fetchCartItems(true))
      .catch((err) => console.error(err));
  };

  const deleteItem = (cartItemId) => {
    if (!isLoggedIn()) {
      const guestItems = loadGuestCart();
      const updated = guestItems.filter((it) => it.id !== cartItemId);
      saveGuestCart(updated);
      setCartItems(updated);
      setCartCount(calculateCount(updated));
      return Promise.resolve();
    }

    return fetch(`${CART_EP}/${cartItemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then(() => fetchCartItems(true))
      .catch((err) => console.error(err));
  };

  const removeAllItems = () => {
    if (!isLoggedIn()) {
      saveGuestCart([]);
      setCartItems([]);
      setCartCount(0);
      return Promise.resolve();
    }
    const promises = cartItems.map((item) =>
      fetch(`${CART_EP}/${item.id}`, { method: 'DELETE', headers: getHeaders() })
    );
    return Promise.all(promises)
      .then(() => fetchCartItems(true))
      .catch((err) => console.error(err));
  };

  // ==================== Favorites Actions ====================
  const addToFavorite = (productId, productData = null) => {
    const idStr = String(productId);

    if (!isLoggedIn()) {
      const guestFavs = loadGuestFavorites();
      const exists = guestFavs.find(
        (f) => String(f.product_id || f.product?.id || f.id) === idStr
      );
      if (!exists) {
        const newFav = {
          id: `guest_fav_${productId}`,
          product_id: productId,
          product: productData,
        };
        const updated = [...guestFavs, newFav];
        saveGuestFavorites(updated);
        setSavedItems(updated);
        setFavoriteCount(updated.length);
      }
      return Promise.resolve();
    }

    return fetch(FAV_EP, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId }),
    })
      .then((res) => res.json())
      .then(() => fetchFavorites());
  };

  const removeFromFavorite = (productId) => {
    const idStr = String(productId);

    if (!isLoggedIn()) {
      const guestFavs = loadGuestFavorites();
      const updated = guestFavs.filter(
        (f) => String(f.product_id || f.product?.id || f.id) !== idStr
      );
      saveGuestFavorites(updated);
      setSavedItems(updated);
      setFavoriteCount(updated.length);
      return Promise.resolve();
    }

    return fetch(`${FAV_EP}/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then(() => fetchFavorites());
  };

  // ==================== Initial Load ====================
  useEffect(() => {
    fetchCartItems(true);
    fetchFavorites();
    fetchOrders();
  }, [fetchCartItems, fetchFavorites, fetchOrders]);

  return (
    <CartContext.Provider
      value={{
        cartItems, savedItems, orders,
        cartCount, favoriteCount, ordersCount,
        loading,
        fetchCartItems, fetchFavorites, fetchOrders,
        addToCart, updateQuantity, deleteItem, removeAllItems,
        addToFavorite, removeFromFavorite,
        markOrdersAsRead, // دالة تصفير العداد
      }}
    >
      {children}
    </CartContext.Provider>
  );
};