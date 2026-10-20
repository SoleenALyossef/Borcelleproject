import React, { useState } from 'react';
import { FiShield, FiMessageSquare, FiTruck, FiShoppingCart } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaApplePay, FaCcAmex } from 'react-icons/fa';
import './CartAndSaved.css';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../i18n/localizedFields';

// 1. Cart Items Component
export const CartItemsList = ({ items, onUpdateQty, onRemove, onSaveForLater, onBackToShop, onRemoveAll }) => {
  const { i18n } = useTranslation();
  return (
    <div className="cart-items-section">
      {items.map((item) => {
        const product = item.product || item;
        const price = parseFloat(product.price || item.price || 0);
        const quantity = item.quantity || 1;
        const imageUrl = product.image || item.image;

        return (
          <div className="cart-item-row" key={item.id}>
            <div className="item-info-group">
              <div className="item-img-box">
                <img src={imageUrl || 'https://via.placeholder.com/150'} alt={localizedName(product, i18n.language, item.title || 'Product')} />
              </div>
              <div className="item-details">
                <h4 className="item-title">{localizedName(product, i18n.language, item.title || 'Product')}</h4>
                <p className="item-specs">
                  Size: {item.size || 'Medium'}, Color: {item.color || 'Blue'}, Material: {item.material || 'Plastic'}
                </p>
                <p className="item-seller">Seller: {item.seller || 'Artel Market'}</p>
                <div className="item-actions-group">
                  <button className="btn-remove" onClick={() => onRemove(item.id)}>Remove</button>
                  <button className="btn-save-later" onClick={() => onSaveForLater(item)}>Save for later</button>
                </div>
              </div>
            </div>

            <div className="item-price-qty-group">
              <span className="item-total-price">${(price * quantity).toFixed(2)}</span>
              <div className="qty-controller">
                <button className="qty-btn" onClick={() => onUpdateQty(item.id, quantity - 1)}>-</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => onUpdateQty(item.id, quantity + 1)}>+</button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="cart-footer-actions">
        <button className="btn-back-shop" onClick={onBackToShop}>
          ← Back to shop
        </button>
        <button className="btn-remove-all" onClick={onRemoveAll}>
          Remove all
        </button>
      </div>
    </div>
  );
};

// 2. Checkout Summary Component
export const CheckoutSummary = ({ subtotal, discount, tax, onApplyCoupon, onCheckout, loading, isCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');

  const originalTotal = subtotal + tax;
  const finalTotal = Math.max(0, subtotal - discount + tax);

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyCoupon) onApplyCoupon(couponCode);
  };

  return (
    <div className="cart-sidebar">
      <div className="coupon-card">
        <p className="coupon-title">Have a coupon?</p>
        <form className="coupon-form" onSubmit={handleApply}>
          <input
            type="text"
            placeholder="Add coupon"
            className="coupon-input"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button type="submit" className="coupon-btn">Apply</button>
        </form>
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Discount:</span>
          <span className="discount-val">- ${discount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span className="tax-val">+ ${tax.toFixed(2)}</span>
        </div>

        <div className="summary-row total">
          <span>Total:</span>
          <div className="total-prices-wrapper">
            {isCouponApplied && discount > 0 && (
              <span className="old-price-strike">${originalTotal.toFixed(2)}</span>
            )}
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button className="btn-checkout" onClick={onCheckout} disabled={loading}>
          {loading ? 'Processing...' : 'Checkout'}
        </button>

        <div className="payment-icons">
          <FaCcAmex /> <FaCcMastercard /> <FaPaypal /> <FaCcVisa /> <FaApplePay />
        </div>
      </div>
    </div>
  );
};

// 3. Features Banner Component
export const FeaturesBanner = () => {
  return (
    <div className="features-banner-row">
      <div className="feature-item">
        <div className="feature-icon-circle"><FiShield size={18} /></div>
        <div className="feature-texts">
          <h4>Secure payment</h4>
          <p>Have you ever finally just</p>
        </div>
      </div>
      <div className="feature-item">
        <div className="feature-icon-circle"><FiMessageSquare size={18} /></div>
        <div className="feature-texts">
          <h4>Customer support</h4>
          <p>Have you ever finally just</p>
        </div>
      </div>
      <div className="feature-item">
        <div className="feature-icon-circle"><FiTruck size={18} /></div>
        <div className="feature-texts">
          <h4>Free delivery</h4>
          <p>Have you ever finally just</p>
        </div>
      </div>
    </div>
  );
};

// 4. Saved For Later 
export const SavedForLater = ({ savedItems, onMoveToCart }) => {
  const { i18n } = useTranslation();
  if (!savedItems || savedItems.length === 0) return null;

  return (
    <div className="saved-section-card">
      <h3 className="saved-section-title">Saved for later</h3>
      <div className="saved-grid">
        {savedItems.map((item) => {
          const product = item.product || item;
       
          const price = parseFloat(product.price || item.price || 0);
        
          const imageUrl = product.image || item.image || 'https://via.placeholder.com/150';
        
          const title = localizedName(product, i18n.language, item.title || 'Product');

          return (
            <div className="saved-product-card" key={item.id || item.product_id}>
              <div className="saved-img-box">
                <img src={imageUrl} alt={title} onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
              </div>
              <div className="saved-price">${price.toFixed(2)}</div>
              <div className="saved-title">{title}</div>
              <button className="btn-move-cart" onClick={() => onMoveToCart(item)}>
                <FiShoppingCart size={15} /> Move to cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Promo Banner Component
export const PromoBanner = () => {
  return (
    <div className="promo-banner">
      <div className="promo-texts">
        <h3>Super discount on more than 100 USD</h3>
        <p>Have you ever finally just write dummy info</p>
      </div>
      <button className="btn-promo-shop">Shop now</button>
    </div>
  );
};