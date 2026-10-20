import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { API_Config } from '../../../Config/API-Config';
import CartModal from '../CartModal';
import { useCart } from '../../../context/CartContext';
import { useTranslation } from 'react-i18next';

const CategorySection = ({ bannerTitle, bannerImage, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();
  const { i18n } = useTranslation();

  useEffect(() => {
    let url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT}`;
    if (category) {
      url += `?search=${encodeURIComponent(category)}`;
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts((data.data || data || []).slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [category]);

  const handleAddToCart = (product, productId) => {
    if (!productId) return;

    setAddingId(productId);
    addToCart(productId, product, 1)
      .then(() => {
        setShowCart(true);
        setAddingId(null);
      })
      .catch((err) => {
        alert('Failed to add: ' + err.message);
        setAddingId(null);
      });
  };

  return (
    <>
        <style>{`
          .custom-loader {
            width: 50px;
            aspect-ratio: 1;
            display: grid;
            -webkit-mask: conic-gradient(from 15deg, #0000, #000);
            animation: l26 1s infinite steps(12);
          }
          .custom-loader, .custom-loader:before, .custom-loader:after {
            background:
              radial-gradient(closest-side at 50% 12.5%, #f13b63 96%, #0000) 50% 0/20% 80% repeat-y,
              radial-gradient(closest-side at 12.5% 50%, #f13b63 96%, #0000) 0 50%/80% 20% repeat-x;
          }
          .custom-loader:before, .custom-loader:after {
            content: ""; grid-area: 1/1; transform: rotate(30deg);
          }
          .custom-loader:after { transform: rotate(60deg); }
          @keyframes l26 { 100% { transform: rotate(1turn); } }
        `}</style>
      <Card className="mb-4 shadow-sm border rounded overflow-hidden">
        <Card.Body className="p-0">
          <Row className="g-0">
            <Col
              lg={3}
              md={4}
              className="p-4 d-flex flex-column justify-content-between position-relative"
              style={{
                backgroundImage: `url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '260px',
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4 className="fw-bold mb-3" style={{ maxWidth: '160px', color: 'var(--text-main)' }}>
                  {bannerTitle}
                </h4>
                <Button
                  variant="light"
                  className="fw-semibold text-dark shadow-sm px-3 py-2 border-0"
                  style={{ borderRadius: '8px' }}
                >
                  Source now
                </Button>
              </div>
            </Col>

            <Col lg={9} md={8}>
              {loading ? (
                <div className=" p-5 text-center my-4 d-flex flex-column align-items-center ">
                 <div className="custom-loader" /> 
                 <p className="mt-3 text-secondary fw-bold mb-0">Loading products...</p>
              </div>
              ) : products.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center h-100 py-5 text-muted">
                  No products available in this section.
                </div>
              ) : (
                <Row className="row-cols-2 row-cols-md-4 g-0 h-100">
                  {products.map((product, index) => {
                    const productId = product.id || product._id;
                    const productName = i18n.language === 'ar'
                      ? (product.ar?.name || product.name || product.en?.name || product.title)
                      : (product.en?.name || product.name || product.ar?.name || product.title);
                    const productPrice =
                      typeof product.price === 'number'
                        ? `$${product.price.toFixed(2)}`
                        : `$${product.price}`;

                    return (
                      <Col
                        key={productId || index}
                        className="p-3 border-start border-bottom position-relative bg-white d-flex flex-column justify-content-between overflow-hidden"
                        style={{ minHeight: '130px', cursor: 'pointer', backgroundColor: 'var(--bg-card)' }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div className="fw-medium small text-truncate" style={{ color: 'var(--text-main)' }}>
                            {productName}
                          </div>
                          <div className="small mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            From <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{productPrice}</span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end align-items-end mt-2" style={{ position: 'relative', zIndex: 1 }}>
                          <img
                            src={product.image || product.thumbnail}
                            alt={productName}
                            style={{
                              width: '65px',
                              height: '65px',
                              objectFit: 'contain',
                              transition: 'transform 0.5s ease',
                              transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
                            }}
                          />
                        </div>

                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--bg-card) 88%, transparent)',
                            opacity: hoveredIndex === index ? 1 : 0,
                            transition: 'opacity 0.4s ease',
                            pointerEvents: hoveredIndex === index ? 'auto' : 'none',
                            zIndex: 2,
                          }}
                        >
                          <Button
                            className="mb-2 w-75 rounded-pill shadow-sm"
                            disabled={addingId === productId}
                            style={{ backgroundColor: 'rgb(241, 59, 99)', border: '1px solid rgb(241, 59, 99)', color: '#fff' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product, productId);
                            }}
                          >
                            {addingId === productId ? (
                               <div className=" p-5 text-center my-4 d-flex flex-column align-items-center ">
                                  <div className="custom-loader" /> 
                                  <p className="mt-3 text-secondary fw-bold mb-0">Loading products...</p>
                               </div>
                            ) : (
                              'Add to cart'
                            )}
                          </Button>

                          <Button
                            className="w-75 rounded-pill shadow-sm bg-white"
                            style={{ border: '1px solid rgb(241, 59, 99)', color: 'rgb(241, 59, 99)' }}
                          >
                            Details
                          </Button>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <CartModal show={showCart} handleClose={() => setShowCart(false)} />
    </>
  );
};

export default CategorySection;