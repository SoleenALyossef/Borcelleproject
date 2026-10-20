import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { FiCheck } from 'react-icons/fi';

const MAIN_COLOR = '#fd3e60';

const ProductDescriptionSection = ({ description }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <Card className="border rounded-3 shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
      <Card.Header className="border-bottom p-0" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="border-0 px-2"
        >
          <Nav.Item>
            <Nav.Link
              eventKey="description"
              className="py-3 px-3 border-0 bg-transparent"
              style={{
                color: activeTab === 'description' ? MAIN_COLOR : 'var(--text-muted)',
                fontWeight: activeTab === 'description' ? '600' : '500',
                borderBottom:
                  activeTab === 'description'
                    ? `2px solid ${MAIN_COLOR}`
                    : '2px solid transparent',
              }}
            >
              Description
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="reviews"
              className="py-3 px-3 border-0 bg-transparent"
              style={{
                color: activeTab === 'reviews' ? MAIN_COLOR : 'var(--text-muted)',
                fontWeight: activeTab === 'reviews' ? '600' : '500',
                borderBottom:
                  activeTab === 'reviews'
                    ? `2px solid ${MAIN_COLOR}`
                    : '2px solid transparent',
              }}
            >
              Reviews
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="shipping"
              className="py-3 px-3 border-0 bg-transparent"
              style={{
                color: activeTab === 'shipping' ? MAIN_COLOR : 'var(--text-muted)',
                fontWeight: activeTab === 'shipping' ? '600' : '500',
                borderBottom:
                  activeTab === 'shipping'
                    ? `2px solid ${MAIN_COLOR}`
                    : '2px solid transparent',
              }}
            >
              Shipping
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="seller"
              className="py-3 px-3 border-0 bg-transparent"
              style={{
                color: activeTab === 'seller' ? MAIN_COLOR : 'var(--text-muted)',
                fontWeight: activeTab === 'seller' ? '600' : '500',
                borderBottom:
                  activeTab === 'seller'
                    ? `2px solid ${MAIN_COLOR}`
                    : '2px solid transparent',
              }}
            >
              About seller
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>

      <Card.Body className="p-4">
        {activeTab === 'description' && (
          <div>
            <p
              className="mb-4"
              style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.7',
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
              }}
            >
              {description || 'No detailed description available for this product.'}
            </p>

            <div className="d-flex flex-column gap-2 small" style={{ color: 'var(--text-muted)' }}>
              <div className="d-flex align-items-center gap-2">
                <FiCheck size={16} />
                <span>Authentic quality guaranteed.</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiCheck size={16} />
                <span>Full refund policy supported.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ color: 'var(--text-muted)' }}>No reviews yet.</div>
        )}

        {activeTab === 'shipping' && (
          <div style={{ color: 'var(--text-muted)' }}>
            Standard worldwide shipping available.
          </div>
        )}

        {activeTab === 'seller' && (
          <div style={{ color: 'var(--text-muted)' }}>
            Guanjoi Trading LLC — Verified supplier since 2015.
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductDescriptionSection;