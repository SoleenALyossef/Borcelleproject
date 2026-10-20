import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

const PageBanner = ({ title, showBack = true }) => {
  return (
    <div className={`pink-gradient-banner ${!title ? 'empty-banner' : ''}`} onClick={() => window.history.back()}>
      {showBack && (
        <IoIosArrowBack size={24} className="back-icon-btn" />
      )}
      {title && <h2 className="banner-title">{title}</h2>}
    </div>
  );
};

export default PageBanner;