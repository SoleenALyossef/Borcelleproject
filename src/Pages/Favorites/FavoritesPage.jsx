import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FiHeart, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../i18n/localizedFields';

const MAIN_COLOR = '#f13b63';

const IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
];
const getImage = (id) => IMAGES[Number(id) % IMAGES.length] || IMAGES[0];

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { savedItems, favoriteCount, fetchFavorites, removeFromFavorite, addToCart } = useCart();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFavorites().finally(() => setLoading(false));
   
  }, []);

  //  استقبال العنصر الكامل بدل الـ ID فقط
  const handleRemove = (favItem) => {
    const productId = favItem.product_id || favItem.product?.id || favItem.id;
    removeFromFavorite(productId).then(() => fetchFavorites());
  };

   const handleAddToCart = (favItem) => {
    const productId = favItem.product_id || favItem.product?.id || favItem.id;
    
    // 1. إضافة المنتج للسلة
    addToCart(productId, favItem.product, 1)
      .then(() => {
        // 2. إزالة المنتج من المفضلة فور إضافته للسلة
        return removeFromFavorite(productId);
      })
      .then(() => {
        // 3. إعادة جلب المفضلة لتحديث الواجهة
        return fetchFavorites();
      })
      .then(() => {
        alert('Added to cart ✅ (Removed from favorites)');
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to process: ' + err.message);
      });
  };

  return (
    <>
      <MainNavbar />
      <Container className="py-4" style={{ minHeight: '70vh' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <Button variant="light" className="rounded-circle p-2 border" onClick={() => navigate(-1)}>
              <FiArrowLeft size={18} />
            </Button>
            <div>
              <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaHeart color={MAIN_COLOR} size={22} /> My Favorites
              </h3>
              <small className="text-muted">{favoriteCount} items</small>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: MAIN_COLOR }} />
          </div>
        ) : savedItems.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
            <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px', background: '#fde8ec' }}>
              <FiHeart size={30} color={MAIN_COLOR} />
            </div>
            <h5 className="fw-bold">No favorites yet</h5>
            <p className="text-muted">Browse products and add your favorites.</p>
            <Button
              onClick={() => navigate('/ProductListing')}
              className="fw-bold px-4 py-2 mt-2 border-0"
              style={{ backgroundColor: MAIN_COLOR, color: '#fff', borderRadius: 8 }}
            >
              Browse Products
            </Button>
          </Card>
        ) : (
          <Row className="g-3">
            {savedItems.map((fav) => {
              // يدعم شكل الـ API (favorite.product) وشكل الزائر (favorite.product)
              const product = fav.product || fav;
              const productId = product.id || fav.product_id || fav.id;
              const price = Number(product.price || 0);
              const title = localizedName(product, i18n.language, 'Product');

              return (
                <Col key={fav.id || productId} xs={12} sm={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 position-relative product-card">
                    {/* زر الإزالة */}
                    <button
                      type="button"
                      onClick={() => handleRemove(fav)}
                      className="btn bg-white border position-absolute d-flex align-items-center justify-content-center p-0 rounded-circle shadow-sm"
                      style={{
                        top: '12px', right: '12px', width: '38px', height: '38px', zIndex: 3,
                        borderColor: MAIN_COLOR,
                        backgroundColor: '#fde8ec',
                        color: MAIN_COLOR,
                      }}
                      title="Remove from favorites"
                    >
                      <FaHeart size={18} />
                    </button>

                    <div
                      className="bg-light rounded-top-4 d-flex align-items-center justify-content-center"
                      style={{ height: '180px', cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${productId}`)}
                    >
                      <img
                        src={product.image || getImage(productId)}
                        alt={title}
                        className="img-fluid p-3"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    <Card.Body className="d-flex flex-column justify-content-between p-3">
                      <div>
                        <h6 className="fw-bold mb-1 text-truncate">{title}</h6>
                        <div className="fw-bold mb-2" style={{ color: MAIN_COLOR }}>
                          ${price.toFixed(2)}
                        </div>
                        <div className="d-flex align-items-center gap-1 small text-muted">
                          <FaStar color="#ff9017" /> <span className="fw-medium">{product.rating || 4.5}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(fav)}
                        className="mt-3 w-100 fw-bold border-0"
                        style={{ backgroundColor: MAIN_COLOR, color: '#fff', borderRadius: 8 }}
                      >
                        <FiShoppingCart size={16} className="me-2" /> Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default FavoritesPage;