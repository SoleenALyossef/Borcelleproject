import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { API_Config } from '../../../Config/API-Config';
import CartModal from '../CartModal';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const RecommendedItems = ({ title = 'Recommended items' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching data');
        return response.json();
      })
      .then((data) => {
        const items = data.data || data || [];
        // إزالة التكرار لضمان عدم وجود مفاتيح مكررة
        const unique = items.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setProducts(unique.slice(0, 10));
      })
      .catch((err) => {
        console.error('Error fetching recommended items:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product, productId) => {
    if (!productId) return;
    setAddingId(productId);
    addToCart(productId, product, 1)
      .then(() => setShowCart(true))
      .catch((err) => alert('Failed to add: ' + err.message))
      .finally(() => setAddingId(null));
  };

  if (loading) return <div className="text-center py-5 text-center d-flex flex-column align-items-center"><div className="custom-loader" /></div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  return (
    <>
      <section className="py-4">
        <h5 className="fw-bold mb-3 fs-5" style={{ color: 'var(--text-main)' }}>{title}</h5>
        <Row className="g-3 row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-5">
          {products.map((item, index) => {
            const productId = item.id || item._id || index;
            return (
              <Col key={productId}>
                <Card
                  className="h-100 border rounded-3 p-2 shadow-sm position-relative overflow-hidden"
                  style={{ cursor: 'pointer', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  onClick={() => navigate(`/product/${productId}`)} // ✅ التوجيه عند الضغط على البطاقة
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2" style={{ height: '150px' }}>
                    <Card.Img
                      variant="top"
                      src={item.image || item.thumbnail || 'https://via.placeholder.com/150'}
                      alt={i18n.language === 'ar' ? (item.ar?.name || item.name || item.en?.name) : (item.en?.name || item.name || item.ar?.name)}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s', transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)' }}
                    />
                  </div>
                  <Card.Body className="p-0">
                    <div className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      ${parseFloat(item.price || 0).toFixed(2)}
                    </div>
                    <p className="small mb-0 text-truncate" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {i18n.language === 'ar' ? (item.ar?.name || item.name || item.en?.name || item.title) : (item.en?.name || item.name || item.ar?.name || item.title)}
                    </p>
                  </Card.Body>
                  
                  {/* أزرار تظهر عند التمرير (Hover) */}
                  {hoveredIndex === index && (
                    <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'var(--bg-card)' }}>
                      <Button
                        size="sm"
                        className="w-100 border-0 fw-bold mb-1"
                        style={{ backgroundColor: 'var(--primary)', color: '#fff', borderRadius: 6 }}
                        onClick={(e) => { 
                          e.stopPropagation(); // ✅ منع التوجيه عند إضافة للسلة
                          handleAddToCart(item, productId); 
                        }}
                        disabled={addingId === productId}
                      >
                        {addingId === productId ? 'Adding...' : 'Add to cart'}
                      </Button>
                      <Button
                        size="sm"
                        className="w-100 border fw-bold"
                        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--primary)', borderRadius: 6, borderColor: 'var(--primary)' }}
                        onClick={(e) => { 
                          e.stopPropagation(); // ✅ منع التوجيه عند مشاهدة التفاصيل
                          navigate(`/product/${productId}`); 
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>
      <CartModal show={showCart} handleClose={() => setShowCart(false)} />
    </>
  );
};

export default RecommendedItems;