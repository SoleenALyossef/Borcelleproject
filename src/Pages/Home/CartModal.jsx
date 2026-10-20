import React, { useEffect } from 'react';
import { Offcanvas, Button, Spinner } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../i18n/localizedFields';

const CartModal = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const {
    cartItems,
    loading,
    fetchCartItems,
    updateQuantity,
    deleteItem,
  } = useCart();

  useEffect(() => {
    if (show) fetchCartItems(false);
  }, [show]);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product?.price || item.price || 0;
      const qty = item.quantity || 1;
      return acc + price * qty;
    }, 0);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/CheckoutPage');
      handleClose();
      navigate('/LoginPage');
      return;
    }

    handleClose();
    navigate('/CheckoutPage');
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{
        width: '400px',
        zIndex: 999999, // ✅ أعلى z-index لضمان الظهور فوق كل شيء
      }}
      backdropStyle={{ zIndex: 999998 }} // ✅ خلفية الـ Offcanvas أيضاً أعلى
      className="cart-offcanvas" // 👈 كلاس إضافي للتحكم
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold text-dark fs-5">Your Shopping Bag</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="px-4 py-3 d-flex flex-column">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-2 text-muted">Loading...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-muted py-5">Your cart is empty</div>
        ) : (
          <div className="d-flex flex-column gap-4 flex-grow-1 overflow-auto">
            {cartItems.map((item) => {
              const product = item.product || item;
              const quantity = item.quantity || 1;
              const price = product.price || 600;
              const productId = product.id || product.product_id || item.product_id;

              return (
                <div
                  key={item.id || productId}
                  className="d-flex align-items-center justify-content-between my-2"
                >
                  <div className="position-relative me-3">
                    <img
                      src={product.image || product.thumbnail}
                      alt={localizedName(product, i18n.language, 'Product')}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                      }}
                    />
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-circle"
                      style={{
                        backgroundColor: '#ff3b69',
                        color: '#fff',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #fff',
                      }}
                    >
                      {quantity}
                    </span>
                  </div>

                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>
                      {localizedName(product, i18n.language, 'Product')}
                    </h6>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <div className="d-flex align-items-center border rounded px-2 py-1 bg-light">
                        <button
                          className="btn btn-sm p-0 border-0 me-2 text-secondary"
                          onClick={() => updateQuantity(productId, quantity, -1)}
                        >
                          -
                        </button>
                        <span className="fw-bold px-1" style={{ fontSize: '0.85rem' }}>
                          {quantity}
                        </span>
                        <button
                          className="btn btn-sm p-0 border-0 ms-2 text-secondary"
                          onClick={() => updateQuantity(productId, quantity, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-sm p-0 border-0 text-danger ms-2"
                        onClick={() => deleteItem(item.id)}
                      >
                        <FaTrashAlt size={16} color="#ff3b69" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="text-end fw-bold"
                    style={{ color: 'var(--primary)', fontSize: '0.95rem' }}
                  >
                    {price} AED
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && cartItems.length > 0 && (
          <div className="mt-auto pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-dark">SubTotal :</span>
              <span className="fw-bold fs-5" style={{ color: 'var(--primary)' }}>
                {calculateSubtotal()} AED
              </span>
            </div>
            <Button
              className="w-100 py-2 border-0 fw-bold"
              style={{ backgroundColor: 'var(--primary)', borderRadius: '8px' }}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartModal;