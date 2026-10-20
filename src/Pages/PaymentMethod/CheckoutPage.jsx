import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner, Container, Modal } from 'react-bootstrap';
import { BiRefresh } from 'react-icons/bi';
import { FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import SuccessModal from './SuccessModal';
import ToastAlert from './ToastAlert';
import AddressModal from './AddressModal';
import image from '../../assets/image/Group 1000007742.png';
import Navbarpayment from './Navbarpayment';
import { API_Config } from '../../Config/API-Config';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { localizedName, localizedDescription } from '../../i18n/localizedFields';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCartItems, removeAllItems, fetchOrders } = useCart();
  const { i18n } = useTranslation();

  const [selectedPayment, setSelectedPayment] = useState('CASH');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); //
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [addressId, setAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const showAlert = (type, message) => setAlert({ show: true, type, message });
  const closeAlert = () => setAlert({ ...alert, show: false });

  const BASE_URL = API_Config?.BASE_URL;
  const ORDER_EP = `${BASE_URL}/order`;
  const ADDRESS_EP = `${BASE_URL}/address`;

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      
      setShowLoginModal(true);
    } else {
      fetchCartItems(false);
      loadAddress();
    }
    // eslint-disable-next-line
  }, []);

  const loadAddress = () => {
    fetch(ADDRESS_EP, { method: 'GET', headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => {
        let list = data?.data?.data || data?.data || data || [];
        if (!Array.isArray(list)) list = [];
        if (list.length > 0) {
          const def = list.find((a) => a.is_default) || list[0];
          setAddressId(def.id);
        }
      })
      .catch((err) => console.error('Address fetch error:', err));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product?.price || item.price || 0);
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const tax = subtotal > 0 ? 14.0 : 0;
  const netTotal = Math.max(0, subtotal + tax - discountAmount);

  const handleApplyCoupon = () => {
    const clean = (couponCode || '').trim().toLowerCase();
    if (clean === 'may26') {
      const calc = subtotal * 0.2;
      setDiscountAmount(calc);
      setAppliedCoupon('may26');
      showAlert('success', `Coupon "may26" applied! You saved ${calc.toFixed(2)} AED`);
    } else if (clean === '') {
      showAlert('info', 'Please enter a coupon code.');
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      showAlert('error', 'Invalid coupon code. Try "may26".');
    }
  };

  const handleConfirmPayment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (cartItems.length === 0) {
      showAlert('error', 'Your cart is empty!');
      return;
    }
    if (!addressId) {
      setShowAddressModal(true);
      return;
    }
    submitOrder();
  };

  const submitOrder = () => {
    setLoading(true);
    setError('');

    const payload = {
      note: 'Order from checkout',
      payment_type: selectedPayment,
      address_id: addressId,
      coupon_code: appliedCoupon || null,
    };

    fetch(ORDER_EP, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverErr) => {
            throw new Error(serverErr.message || 'Failed to place order');
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Order success:', data);
        fetchOrders();
        setShowSuccessModal(true);
        removeAllItems();
      })
      .catch((err) => {
        console.error('Order error:', err);
        setError(err.message || 'Something went wrong');
        showAlert('error', err.message || 'Something went wrong');
      })
      .finally(() => setLoading(false));
  };

  const handleAddressSaved = (newAddressId) => {
    setAddressId(newAddressId);
    setTimeout(() => submitOrder(), 300);
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleGoToLogin = () => {
    setShowLoginModal(false);
    localStorage.setItem('redirectAfterLogin', '/CheckoutPage');
    navigate('/LoginPage');
  };

  return (
    <>
     
      <Navbarpayment />

      <Container fluid className="p-0">
        <Row className="m-0">
          <Col xs={12} md={6} className="payment-left-section">
            <h3 className="fw-semibold mb-1">Payment Method</h3>
            <p className="text-white-50 mb-4" style={{ fontSize: '0.85rem' }}>
              Pick your payment method
            </p>

            <div className="mb-4">
              <div className="payment-option d-flex align-items-center justify-content-between" onClick={() => setSelectedPayment('CASH')}>
                <span className="fs-6">Cash</span>
                <div className={`custom-radio ${selectedPayment === 'CASH' ? 'active' : ''}`} />
              </div>
              <div className="payment-option d-flex align-items-center justify-content-between" onClick={() => setSelectedPayment('SYRIATEL')}>
                <div className="d-flex align-items-center gap-2">
                  <img src="../src/assets/image/Ellipse 11.png" alt="Syriatel" />
                  <span className="fs-6">Syriatel</span>
                </div>
                <div className={`custom-radio ${selectedPayment === 'SYRIATEL' ? 'active' : ''}`} />
              </div>
              <div className="payment-option d-flex align-items-center justify-content-between" onClick={() => setSelectedPayment('MTN')}>
                <div className="d-flex align-items-center gap-2">
                  <img src="../src/assets/image/Ellipse 13.png" alt="MTN" />
                  <span className="fs-6">MTN</span>
                </div>
                <div className={`custom-radio ${selectedPayment === 'MTN' ? 'active' : ''}`} />
              </div>
            </div>

            <div>
              <Form.Label style={{ fontSize: '0.85rem' }}>Discount Code</Form.Label>
              <div className="discount-input-container">
                <Form.Control className="discount-input" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <Button className="btn-check-code" onClick={handleApplyCoupon} type="button">
                  <BiRefresh /> Check
                </Button>
              </div>
              {appliedCoupon && <small className="text-success d-block mt-2">✅ Coupon applied: {appliedCoupon}</small>}
            </div>
          </Col>

          <Col xs={12} md={6} className="payment-right-section d-flex flex-column justify-content-between">
            <div>
              <div className="mb-4">
                {cartItems.length === 0 ? (
                  <div className="text-center text-muted py-5">No items in cart</div>
                ) : (
                  cartItems.map((item) => {
                    const product = item.product || item;
                    const qty = item.quantity || 1;
                    const price = parseFloat(product.price || item.price || 0);
                    return (
                      <div key={item.id || product.id} className="cart-item-row">
                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                          <img src={product.image || product.thumbnail || image} alt={localizedName(product, i18n.language, 'Product')} className="cart-item-img" />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold checkout-item-title">{localizedName(product, i18n.language, 'Product')}</h6>
                            <small className="checkout-item-desc">{localizedDescription(product, i18n.language, '')}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="item-qty-badge">{qty}</span>
                          <span className="price-text">{price.toFixed(2)} AED</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-4 pt-3">
                <div className="d-flex justify-content-between mb-2 summary-line"><span>Total</span><span className="fw-semibold">{subtotal.toFixed(2)} AED</span></div>
                <div className="d-flex justify-content-between mb-2 summary-line"><span>Discount</span><span className="fw-semibold">- {discountAmount.toFixed(2)} AED</span></div>
                <div className="d-flex justify-content-between mb-3 summary-line"><span>Tax</span><span className="fw-semibold">{tax.toFixed(2)} AED</span></div>
                <hr className="my-3 opacity-25" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="summary-total-label">Net Total</span>
                  <span className="net-total-price">{netTotal.toFixed(2)} AED</span>
                </div>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
              </div>
            </div>

            <Button className="btn-primary-custom w-100 py-3 mt-3 fs-6" onClick={handleConfirmPayment} disabled={loading || cartItems.length === 0}>
              {loading ? (
                <><Spinner as="span" animation="border" size="sm" className="me-2" />Processing...</>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </Col>
        </Row>
      </Container>

      {/* تسجيل الدخول */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered backdrop="static" contentClassName="custom-alert-modal">
        <Modal.Body className="text-center py-4 px-4">
          <div className="mb-3 d-flex justify-content-center">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', background: '#fde8ec' }}>
              <FiLock size={32} color="#f13b63" />
            </div>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Login Required</h5>
          <p className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            You need to be logged in to proceed with the checkout. Please sign in or create an account.
          </p>
          <div className="d-flex gap-2">
            <Button variant="light" className="flex-fill py-2 border" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button className="flex-fill py-2 border-0 fw-semibold" style={{ backgroundColor: '#f13b63', color: '#fff' }} onClick={handleGoToLogin}>
              Login / Register
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <SuccessModal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} onContinue={handleContinue} />
      <ToastAlert show={alert.show} onClose={closeAlert} type={alert.type} message={alert.message} />
      <AddressModal show={showAddressModal} onHide={() => setShowAddressModal(false)} onSaved={handleAddressSaved} />
    </>
  );
};

export default CheckoutPage;