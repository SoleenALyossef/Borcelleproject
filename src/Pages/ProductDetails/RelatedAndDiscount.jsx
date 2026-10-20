import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { API_Config } from '../../Config/API-Config';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../i18n/localizedFields';

const RelatedAndDiscount = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const BASE_URL = API_Config?.BASE_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/product`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch related products');
        return res.json();
      })
      .then((result) => {
        const items = result?.data?.data || result?.data || result || [];
        const filtered = items.filter((p) => p.id !== currentProductId).slice(0, 6);
        setProducts(filtered);
      })
      .catch((err) => console.error('Error loading related products:', err))
      .finally(() => setLoading(false));
  }, [currentProductId]);

  return (
    <Container className="my-4 px-0">
      <Card
        className="border rounded-3 p-3 p-md-4 mb-4 shadow-sm"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <h3 className="fs-6 fw-bold text-dark mb-3 mb-md-4">Related products</h3>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="danger" />
          </div>
        ) : (
          <Row className="g-3">
            {products.map((item) => (
              <Col key={item.id} xs={6} md={4} lg={2}>
                <div
                  className="d-flex flex-column gap-2 h-100"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.id}`)}
                >
               
                  <div
                    className="rounded-2 overflow-hidden"
                    style={{
                      height: '160px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <img
                      src={item.image || item.thumbnail || 'https://via.placeholder.com/150'}
                      alt={localizedName(item, i18n.language, 'Product')}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </div>
                  <div>
                    <h4
                      className="fw-normal text-dark mb-1 text-truncate"
                      style={{ fontSize: '0.85rem', lineHeight: '1.3' }}
                    >
                      {localizedName(item, i18n.language, 'Product')}
                    </h4>
                    <span style={{ fontSize: '0.85rem', color: '#8b96a5' }}>
                      ${parseFloat(item.price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Banner */}
      <div
        className="rounded-3 p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 text-white overflow-hidden position-relative"
        style={{
          background: 'linear-gradient(135deg, #cc3853 0%, #a42c42 100%)',
        }}
      >
        <div className="d-flex flex-column gap-1 z-1">
          <h2 className="fs-5 fw-bold mb-0">Super discount on more than 100 USD</h2>
          <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
            Have you ever finally just write dummy info
          </p>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="border-0 px-4 py-2 fw-medium text-white flex-shrink-0 z-1"
          style={{ backgroundColor: '#ff9017', fontSize: '0.95rem' }}
        >
          Shop now
        </Button>
      </div>
    </Container>
  );
};

export default RelatedAndDiscount;