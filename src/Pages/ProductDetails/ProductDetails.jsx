import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
  FiCheck,
  FiMessageSquare,
  FiShoppingBag,
  FiShield,
  FiGlobe,
  FiHeart,
  FiShoppingCart,
} from 'react-icons/fi';
import { FaStar, FaHeart } from 'react-icons/fa';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import ProductDescriptionSection from './ProductDescriptionSection';
import RelatedAndDiscount from './RelatedAndDiscount';
import { API_Config } from '../../Config/API-Config';
import { useCart } from '../../context/CartContext';
import { localizedName } from '../../i18n/localizedFields';
import { useTranslation } from 'react-i18next';
import '../../../src/index.css';

const MAIN_COLOR = '#fa3455';
const BASE_URL = API_Config.BASE_URL;
const SITE_ROOT = API_Config.BASE_URL.replace(/\/api\/?$/, '');
const resolveProductImage = (value) => {
  const path = typeof value === 'object' && value ? (value.url || value.path || value.image) : value;
  if (typeof path !== 'string' || !path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const clean = path.replace(/^\/+/, '');
  return clean.startsWith('storage/') ? `${SITE_ROOT}/${clean}` : `${SITE_ROOT}/storage/${clean}`;
};
const getProductImages = (item) => {
  const primary = Array.isArray(item?.image) ? item.image : [item?.image];
  const secondary = Array.isArray(item?.images) ? item.images : [];
  return [...primary, ...secondary].map(resolveProductImage).filter(Boolean).filter((value, index, list) => list.indexOf(value) === index);
};

const ProductDetails = () => {
  const { id } = useParams();
  const productId = id;
  const navigate = useNavigate();

  const { addToCart, savedItems, addToFavorite, removeFromFavorite } = useCart();
  const { i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSaved = (savedItems || []).some((fav) => String(fav.product_id || fav.product?.id || fav.id) === String(product?.id));
  const [activeImage, setActiveImage] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [related, setRelated] = useState([]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    if (!productId) return;
    // Initial state is already loading; fetch directly when the route id changes.
    fetch(`${BASE_URL}/product/${productId}`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product details');
        return res.json();
      })
      .then((result) => {
        const data = result?.data || result;
        setProduct(data);
        const images = getProductImages(data);
        setActiveImage(images[0] || 'https://via.placeholder.com/400');
      })
      .catch((err) => console.error('Error fetching product:', err))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    fetch(`${BASE_URL}/product`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        const items = result?.data?.data || result?.data || result || [];
        const filtered = items.filter((p) => p.id !== Number(productId)).slice(0, 5);
        setRelated(filtered);
      })
      .catch((err) => console.error('Related fetch error:', err));
  }, [productId]);

  const handleAddToCart = () => {
    if (!product?.id) return;
    setCartLoading(true);

    addToCart(product.id, product, 1)
      .then(() => {
        alert('Item added to cart successfully!');
      })
      .catch((err) => {
        console.error('Add to cart error:', err);
        alert('Failed to add to cart');
      })
      .finally(() => setCartLoading(false));
  };

  const handleToggleSave = () => {
    if (!product?.id) return;

    if (isSaved) {
      removeFromFavorite(product.id);
    } else {
      addToFavorite(product.id, product);
    }
  };

  if (loading) {
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
        <MainNavbar />
        <Container className="text-center my-5 py-5">
           <div className="bg-white rounded-4 border p-5 text-center my-4 d-flex flex-column align-items-center shadow-sm">
                 <div className="custom-loader" />
                 <p className="mt-3 text-secondary fw-bold mb-0">Loading product details...</p>
              </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <MainNavbar />
        <Container className="text-center my-5 py-5">
          <h5 className="text-muted">Product not found</h5>
          <Button onClick={() => navigate('/')} className="mt-3">Back to home</Button>
        </Container>
        <Footer />
      </>
    );
  }

  const imageList = getProductImages(product).length
    ? getProductImages(product)
    : ['https://via.placeholder.com/400'];
  const productName = i18n.language === 'ar'
    ? (product?.ar?.name || product?.name || product?.en?.name || product?.title)
    : (product?.en?.name || product?.name || product?.title || product?.ar?.name);
  const productDescription = i18n.language === 'ar'
    ? (product?.ar?.description || product?.description || product?.en?.description)
    : (product?.en?.description || product?.description || product?.ar?.description);

  const oldPrice = product?.old_price || null;

  return (
    <>
      <MainNavbar />

      <Container className="my-4">
        <Card className="border rounded-3 p-3 p-md-4 shadow-sm bg-white">
          <Row className="g-4">
            {/* ===== Gallery ===== */}
            <Col lg={4} md={5}>
              <div
                className="rounded-3 mb-3 overflow-hidden"
                style={{ 
                  height: '350px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={activeImage}
                  alt={productName}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    display: 'block'
                  }}
                />
              </div>

              <div className="d-flex justify-content-start gap-2 overflow-auto pb-1">
                {imageList.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className="rounded-2 overflow-hidden"
                    style={{
                      width: '70px', 
                      height: '70px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: `2px solid ${activeImage === img ? MAIN_COLOR : 'var(--border-color)'}`,
                      backgroundColor: 'var(--bg-card)',
                      padding: '4px'
                    }}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            </Col>

            {/* ===== Details ===== */}
            <Col lg={5} md={7}>
              <div className="text-success small fw-medium d-flex align-items-center gap-1 mb-2">
                <FiCheck size={16} /> In stock
              </div>

              <h1 className="fs-5 fw-semibold text-dark mb-3" style={{ lineHeight: '1.4' }}>
                {productName}
              </h1>

              <div className="d-flex align-items-center gap-2 small text-muted mb-3 flex-wrap">
                <div className="d-inline-flex gap-1" style={{ color: '#ff9017', fontSize: '0.9rem' }}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar color="#e3e8ee" />
                </div>
                <span className="fw-bold" style={{ color: '#ff9017' }}>4.5</span>
                <span className="text-black-50">•</span>
                <div className="d-flex align-items-center gap-1 text-secondary">
                  <FiMessageSquare size={14} /> 32 reviews
                </div>
                <span className="text-black-50">•</span>
                <div className="d-flex align-items-center gap-1 text-secondary">
                  <FiShoppingBag size={14} /> 154 sold
                </div>
              </div>

              {/* Price box */}
              <div
                className="p-3 rounded-2 mb-4 d-flex gap-4 align-items-center"
                style={{ backgroundColor: '#fff0e5' }}
              >
                <div>
                  <span className="fw-bold fs-4" style={{ color: MAIN_COLOR }}>
                    ${parseFloat(product?.price || 0).toFixed(2)}
                  </span>
                  {oldPrice && (
                    <span className="small text-secondary ms-2 text-decoration-line-through">
                      ${parseFloat(oldPrice).toFixed(2)}
                    </span>
                  )}
                  <span className="small text-secondary ms-2">/ per item</span>
                </div>
              </div>

              {/* Specs */}
              <div className="d-flex flex-column gap-2 small mb-4">
                <Row className="pb-2 border-bottom align-items-baseline">
                  <Col xs={4} className="text-secondary">Price:</Col>
                  <Col xs={8} className="text-dark fw-medium">Negotiable</Col>
                </Row>
                <Row className="pb-2 border-bottom align-items-baseline">
                  <Col xs={4} className="text-secondary">Type:</Col>
                  <Col xs={8} className="text-dark">{product?.category?.name || 'Classic shoes'}</Col>
                </Row>
                <Row className="pb-2 border-bottom align-items-baseline">
                  <Col xs={4} className="text-secondary">Material:</Col>
                  <Col xs={8} className="text-dark">Plastic material</Col>
                </Row>
                <Row className="pb-2 border-bottom align-items-baseline">
                  <Col xs={4} className="text-secondary">Design:</Col>
                  <Col xs={8} className="text-dark">Modern nice</Col>
                </Row>
                <Row className="pb-2 border-bottom align-items-baseline">
                  <Col xs={4} className="text-secondary">Customization:</Col>
                  <Col xs={8} className="text-dark">Customized logo and design custom packages</Col>
                </Row>
                <Row className="pb-2 border-bottom align-items-baseline">
                  <Col xs={4} className="text-secondary">Protection:</Col>
                  <Col xs={8} className="text-dark">Refund Policy</Col>
                </Row>
                <Row className="pb-2 align-items-baseline">
                  <Col xs={4} className="text-secondary">Warranty:</Col>
                  <Col xs={8} className="text-dark">2 years full warranty</Col>
                </Row>
              </div>

              {/* Add to cart */}
              <div className="d-flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="px-4 py-2 fw-medium border-0 d-flex align-items-center gap-2"
                  style={{ backgroundColor: MAIN_COLOR, color: '#fff' }}
                >
                  <FiShoppingCart size={18} />
                  {cartLoading ? 'Adding...' : 'Add to cart'}
                </Button>
              </div>
            </Col>

            {/* ===== Supplier card ===== */}
            <Col lg={3}>
              <Card className="border rounded-3 p-3 mb-3" style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
                  <div
                    className="rounded-2 fw-bold d-flex align-items-center justify-content-center fs-4"
                    style={{ width: '48px', height: '48px', backgroundColor: '#ccefff', color: '#4db4d7' }}
                  >
                    R
                  </div>
                  <div>
                    <div className="small text-secondary">Supplier</div>
                    <div className="fw-medium text-dark">Guanjoi Trading LLC</div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 small text-secondary mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span>🇩🇪 Germany, Berlin</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FiShield size={16} /> <span>Verified Seller</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FiGlobe size={16} /> <span>Worldwide shipping</span>
                  </div>
                </div>

                <Button className="w-100 mb-2 border-0 fw-medium" style={{ backgroundColor: MAIN_COLOR, color: '#fff' }}>
                  Send inquiry
                </Button>

                <Button
                  variant="link"
                  onClick={handleToggleSave}
                  className="text-decoration-none d-flex align-items-center justify-content-center gap-2 fw-medium p-2 w-100"
                  style={{ color: MAIN_COLOR }}
                >
                  {isSaved ? <FaHeart size={16} /> : <FiHeart size={16} />}
                  {isSaved ? 'Saved in favorites' : 'Save for later'}
                </Button>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* === Description + You may also like === */}
        <Row className="g-4 mt-3">
          <Col lg={9}>
            <ProductDescriptionSection description={productDescription} />
          </Col>

          <Col lg={3}>
            <Card className="border rounded-3 p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
              <h6 className="fw-bold text-dark mb-3">You may also like</h6>
              <div className="d-flex flex-column gap-3">
                {related.slice(0, 5).map((item) => (
                  <Link key={item.id} to={`/product/${item.id}`} className="d-flex gap-2 text-decoration-none">
                    <div
                      className="border rounded-2 d-flex align-items-center justify-content-center"
                      style={{ width: '56px', height: '56px', backgroundColor: 'var(--bg-secondary)', flexShrink: 0 }}
                    >
                      <img src={item.image || item.thumbnail} alt={localizedName(item, i18n.language, 'Product')} className="mw-100 mh-100" style={{ objectFit: 'contain' }} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="small text-truncate" style={{ color: 'var(--text-main)' }}>{localizedName(item, i18n.language, 'Product')}</div>
                      <div className="small" style={{ color: '#8b96a5' }}>
                        ${parseFloat(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <RelatedAndDiscount currentProductId={product?.id} />
      </Container>

      <Footer />
    </>
  );
};

export default ProductDetails;