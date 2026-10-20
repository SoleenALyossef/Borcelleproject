import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Badge, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FiPackage, FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../i18n/localizedFields';

const MAIN_COLOR = '#f13b63';

const statusColor = (status = '') => {
  const s = status.toLowerCase();
  if (s.includes('deliver')) return { bg: '#d1fae5', text: '#065f46' };
  if (s.includes('cancel')) return { bg: '#fee2e2', text: '#991b1b' };
  if (s.includes('pending')) return { bg: '#fef3c7', text: '#92400e' };
  return { bg: '#e5e7eb', text: '#374151' };
};

const formatDate = (dateString, language = 'en') => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateString, language = 'en') => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, markOrdersAsRead } = useCart();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOrders().finally(() => {
      setLoading(false);
      // ✅ تصفير العداد بمجرد دخول الصفحة
      markOrdersAsRead();
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <MainNavbar />
      <Container className="py-4" style={{ minHeight: '70vh' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button variant="light" className="rounded-circle p-2 border" onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} />
          </Button>
          <div>
            <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FiPackage size={22} color={MAIN_COLOR} /> My Orders
            </h3>
            <small className="text-muted">{orders.length} order(s) total</small>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: MAIN_COLOR }} />
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
            <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px', background: '#fde8ec' }}>
              <FiPackage size={30} color={MAIN_COLOR} />
            </div>
            <h5 className="fw-bold">No orders yet</h5>
            <p className="text-muted">Your completed orders will appear here.</p>
            <Button
              onClick={() => navigate('/ProductListing')}
              className="fw-bold px-4 py-2 mt-2 border-0"
              style={{ backgroundColor: MAIN_COLOR, color: '#fff', borderRadius: 8 }}
            >
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => {
              const colors = statusColor(order.status);
              const items = order.items || order.order_items || [];
              const total = order.total || order.net_total || 0;
              const paymentType = order.payment_type || 'CASH';
              const address = order.address || null;

              return (
                <Card key={order.id} className="border-0 shadow-sm rounded-4 overflow-hidden">
                  {/* Header */}
                  <div className="p-3 d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ backgroundColor: '#fdf2f4' }}>
                    <div>
                      <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                      <div className="d-flex align-items-center gap-3 small text-muted flex-wrap">
                        <span className="d-flex align-items-center gap-1">
                          <FiCalendar size={13} /> {formatDate(order.created_at, i18n.language)}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <FiClock size={13} /> {formatTime(order.created_at, i18n.language)}
                        </span>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: colors.bg, color: colors.text, padding: '6px 12px', fontWeight: 600 }}>
                      {order.status || 'Pending'}
                    </Badge>
                  </div>

                  <Card.Body className="p-3">
                    {/* Items */}
                    {items.length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2 fw-semibold small text-muted">
                          <FiShoppingBag size={14} /> Items ({items.length})
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {items.map((item, idx) => {
                            const product = item.product || item;
                            return (
                              <div key={idx} className="d-flex align-items-center gap-3 border-bottom pb-2">
                                <div className="bg-light rounded-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <img
                                    src={product.image || 'https://via.placeholder.com/50'}
                                    alt={localizedName(product, i18n.language, 'Product')}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-medium small">{localizedName(product, i18n.language, 'Product')}</div>
                                  <div className="text-muted small">x{item.quantity || 1}</div>
                                </div>
                                <div className="fw-bold small" style={{ color: MAIN_COLOR }}>
                                  ${parseFloat(product.price || 0).toFixed(2)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {address && (
                      <div className="mb-3 d-flex align-items-start gap-2 small text-muted">
                        <FiMapPin size={14} className="mt-1" />
                        <span>
                          {address.city}, {address.street}, {address.building}
                        </span>
                      </div>
                    )}

                    {/* Summary */}
                    <Row className="g-2 pt-2 border-top">
                      <Col xs={6}>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                          <FiCreditCard size={14} /> Payment: <strong>{paymentType}</strong>
                        </div>
                      </Col>
                      <Col xs={6} className="text-end">
                        <span className="text-muted small">Total: </span>
                        <span className="fw-bold fs-5" style={{ color: MAIN_COLOR }}>
                          {parseFloat(total).toFixed(2)} AED
                        </span>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default OrdersPage;