// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    home: 'Home',
    cart: 'My cart',
    favorites: 'Orders',
    profile: 'Profile',
    message: 'Message',
    search: 'Search',
    allCategory: 'All category',
    hotOffers: 'Hot offers',
    giftBoxes: 'Gift boxes',
    aboutUs: 'About Us',
    help: 'Help',
    login: 'Log in',
    joinNow: 'Join now',
    addToCart: 'Add to cart',
    details: 'Details',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    total: 'Total',
    relatedProducts: 'Related products',
    recommendedItems: 'Recommended items',
    dealsAndOffers: 'Deals and offers',
    ourExtraServices: 'Our extra services',
    suppliersByRegion: 'Suppliers by region',
  },
  ar: {
    home: 'الرئيسية',
    cart: 'سلتي',
    favorites: 'طلباتي',
    profile: 'حسابي',
    message: 'الرسائل',
    search: 'بحث',
    allCategory: 'كل الفئات',
    hotOffers: 'عروض ساخنة',
    giftBoxes: 'صناديق الهدايا',
    aboutUs: 'من نحن',
    help: 'مساعدة',
    login: 'تسجيل دخول',
    joinNow: 'انضم الآن',
    addToCart: 'أضف للسلة',
    details: 'التفاصيل',
    checkout: 'إتمام الشراء',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    tax: 'الضريبة',
    total: 'الإجمالي',
    relatedProducts: 'منتجات ذات صلة',
    recommendedItems: 'منتجات موصى بها',
    dealsAndOffers: 'عروض وصفقات',
    ourExtraServices: 'خدماتنا الإضافية',
    suppliersByRegion: 'الموردون حسب المنطقة',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);