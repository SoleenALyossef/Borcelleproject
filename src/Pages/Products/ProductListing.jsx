import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { Container, Row, Col, Form, Button, Card, ButtonGroup, Offcanvas, Collapse } from 'react-bootstrap';
import { FiChevronUp, FiChevronDown, FiHeart, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiSearch, FiFilter } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import { API_Config } from '../../Config/API-Config';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';

const MAIN_COLOR = '#f13b63';
const ITEMS_PER_PAGE = 15;

// ---------- الصور ----------
const SITE_ROOT = API_Config.BASE_URL.replace(/\/api\/?$/, '');
const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
    '<rect width="300" height="300" fill="#f1f3f5"/>' +
    '<path d="M90 200l40-50 30 35 20-25 30 40z" fill="#ced4da"/>' +
    '<circle cx="110" cy="110" r="14" fill="#ced4da"/></svg>'
  );

const getImageCandidates = (img) => {
  const raw = Array.isArray(img) ? img[0] : img;
  const path = raw && typeof raw === 'object' ? raw.url || raw.path || raw.image : raw;
  if (!path || typeof path !== 'string') return [];
  if (path.startsWith('data:')) return [path];

  if (/^(https?:)?\/\//.test(path)) {
    const list = [path];
    try {
      list.push(`${SITE_ROOT}${new URL(path, window.location.origin).pathname}`);
    } catch { /* ignore */ }
    return list;
  }

  const clean = path.replace(/^\/+/, '');
  return clean.startsWith('storage/')
    ? [`${SITE_ROOT}/${clean}`]
    : [`${SITE_ROOT}/storage/${clean}`, `${SITE_ROOT}/${clean}`];
};

const SORT_OPTIONS = {
  featured:    { label: 'Featured' },
  'name-asc':  { label: 'Name: A to Z',        order_by: 'name',       order: 'asc' },
  'name-desc': { label: 'Name: Z to A',        order_by: 'name',       order: 'desc' },
  'price-asc': { label: 'Price: Low to High',  order_by: 'price',      order: 'asc' },
  'price-desc':{ label: 'Price: High to Low',  order_by: 'price',      order: 'desc' },
  newest:      { label: 'Newest first',        order_by: 'created_at', order: 'desc' },
  oldest:      { label: 'Oldest first',        order_by: 'created_at', order: 'asc' },
};



const RenderStars = () => (
  <div className="d-inline-flex gap-1" style={{ color: '#ff9017', fontSize: '0.85rem' }}>
    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar color="#e3e8ee" />
  </div>
);

const getFavId = (fav) =>
  fav !== null && typeof fav === 'object'
    ? fav.product_id || fav.product?.id || fav.id
    : fav;

// ✅ Skeleton Card (لتأثير التحميل)
const SkeletonCard = () => (
  <Card className="h-100 border rounded-3 p-3 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
    <div className="bg-light rounded-2 mb-3" style={{ height: '170px', animation: 'pulse 1.5s infinite' }}></div>
    <div className="bg-light rounded-2 mb-2" style={{ height: '20px', width: '80%', animation: 'pulse 1.5s infinite' }}></div>
    <div className="bg-light rounded-2 mb-2" style={{ height: '16px', width: '40%', animation: 'pulse 1.5s infinite' }}></div>
    <div className="bg-light rounded-2" style={{ height: '16px', width: '60%', animation: 'pulse 1.5s infinite' }}></div>
  </Card>
);

// 2. زر المفضلة 
const PARTICLES = [0, 1, 2, 3, 4, 5];

const FavoriteBtn = ({ product }) => {
  const { savedItems, addToFavorite, removeFromFavorite } = useCart();
  const [animating, setAnimating] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!product) return null;

  const productId = product.product_id || product.product?.id || product.id;
  if (!productId) return null;

  const isFavorite = (savedItems || []).some(
    (fav) => String(getFavId(fav)) === String(productId)
  );

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);

    const action = isFavorite 
      ? removeFromFavorite(productId) 
      : addToFavorite(productId, product);

    if (!isFavorite) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 700);
    }

    Promise.resolve(action)
      .catch((err) => console.error('Favorite error:', err))
      .finally(() => setBusy(false));
  };

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className="btn bg-white border position-absolute d-flex align-items-center justify-content-center p-0 rounded-circle shadow-sm"
      style={{
        top: '10px',
        right: '10px',
        width: '34px',
        height: '34px',
        zIndex: 3,
        borderColor: isFavorite ? MAIN_COLOR : '#e3e8ee',
        backgroundColor: isFavorite ? '#fde8ec' : '#ffffff',
        color: isFavorite ? MAIN_COLOR : '#8b96a5',
        transition: 'all 0.2s ease'
      }}
      onClick={handleClick}
    >
      <span className={animating ? 'heart-pop d-flex' : 'd-flex'}>
        <FiHeart size={16} fill={isFavorite ? MAIN_COLOR : 'none'} />
      </span>
      {animating && PARTICLES.map((i) => (
        <span key={i} className="heart-particle" style={{ '--angle': `${i * 60}deg` }} />
      ))}
    </button>
  );
};

// ✅ تحسين شكل الصورة
const SquareImage = ({ sources = [], alt }) => {
  const [idx, setIdx] = useState(0);
  const src = sources[idx] || PLACEHOLDER_IMG;

  return (
    <div 
      className="rounded-3 overflow-hidden" 
      style={{ 
        width: '100%', 
        aspectRatio: '1/1', // ✅ يجعل الصورة مربعة تماماً
        backgroundColor: '#f8f9fa',
        position: 'relative'
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // ✅ تملأ المساحة
          position: 'absolute',
          top: 0,
          left: 0
        }}
        onError={() => setIdx((i) => i + 1)}
      />
    </div>
  );
};

// 3. (عرض القائمة - List)
const ProductListCard = ({ product }) => (
  <Card className="w-100 border rounded-3 shadow-sm position-relative overflow-hidden mb-2 mb-md-3">
    <Card.Body className="p-2 p-md-3">
      <Row className="align-items-center g-2 g-md-3">
        <Col xs={4} md={3}>
          <Link to={`/product/${product.id}`} className="d-block">
            <SquareImage key={product.imageSources?.[0]} sources={product.imageSources} alt={product.title} />
          </Link>
        </Col>
        <Col xs={8} md={9}>
          <h5 className="fs-6 fw-medium mb-1 mb-md-2 pe-5">
            <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">{product.title}</Link>
          </h5>

          <div className="d-flex align-items-baseline gap-2 mb-1 mb-md-2">
            <span className="fs-6 fs-md-5 fw-bold text-dark">${product.price}.00</span>
            {product.oldPrice && <span className="text-muted small text-decoration-line-through">${product.oldPrice}.00</span>}
          </div>

          <div className="d-flex align-items-center gap-2 small text-muted mb-1 mb-md-2 flex-wrap">
            <RenderStars />
            <span className="fw-semibold" style={{ color: '#ff9017' }}>{product.rating || 4.5}</span>
            {product.freeShipping && <span className="text-success fw-medium">Free Shipping</span>}
          </div>

          <p className="text-secondary small mb-2 d-none d-md-block" style={{ lineHeight: '1.5' }}>
            {product.description}
          </p>

          <Link to={`/product/${product.id}`} className="text-decoration-none fw-medium small" style={{ color: MAIN_COLOR }}>View details</Link>
        </Col>
      </Row>
    </Card.Body>
    <FavoriteBtn product={product} />
  </Card>
);

// 4. (عرض الشبكة - Grid)
const ProductGridCard = ({ product }) => (
  <Card className="h-100 border rounded-3 p-2 p-md-3 position-relative shadow-sm d-flex flex-column hover-shadow transition-all">
    <FavoriteBtn product={product} />
    <div className="mb-2">
      <Link to={`/product/${product.id}`} className="d-block">
        <SquareImage key={product.imageSources?.[0]} sources={product.imageSources} alt={product.title} />
      </Link>
    </div>
    <h6
      className="fs-6 fw-medium text-dark mb-2"
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: '2.6em',
        lineHeight: '1.3'
      }}
    >
      <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">{product.title}</Link>
    </h6>
    <div className="d-flex align-items-baseline gap-2 mb-1">
      <span className="fw-bold fs-6 text-dark">${product.price}.00</span>
      {product.oldPrice && <span className="text-muted small text-decoration-line-through">${product.oldPrice}.00</span>}
    </div>
    <div className="d-flex align-items-center gap-2 small text-muted mb-2">
      <RenderStars />
      <span className="fw-semibold" style={{ color: '#ff9017' }}>{product.rating || 4.5}</span>
    </div>
    <div className="pt-2 border-top mt-auto d-flex justify-content-between align-items-center">
      <Link to={`/product/${product.id}`} className="text-decoration-none fw-medium small" style={{ color: MAIN_COLOR }}>View details</Link>
      {product.freeShipping && <span className="badge bg-success-subtle text-success small">Free Ship</span>}
    </div>
  </Card>
);

// 5.  الفلترة القابل للطي
const CollapsibleFilterGroup = ({ title, items, selected, onToggle, type = 'checkbox', defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, 4);

  return (
    <div className="p-3 border-bottom">
      <div
        className="d-flex justify-content-between align-items-center fw-semibold text-dark mb-2"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      <Collapse in={open}>
        <div>
          {displayedItems.map(item => {
            const isChecked = type === 'radio' ? selected === item : selected.includes(item);
            return (
              <div
                key={item}
                className="d-flex align-items-center gap-2 mb-2 p-1 rounded hover-bg"
                style={{ cursor: 'pointer' }}
                onClick={() => onToggle(item)}
              >
                <Form.Check type={type} id={`filter-${title}-${item}`} checked={isChecked} onChange={() => {}} />
                <span className="text-secondary small">{item}</span>
              </div>
            );
          })}

          {items.length > 4 && (
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small fw-medium mt-1"
              style={{ color: MAIN_COLOR, fontSize: '0.8rem' }}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show less' : `+ See all (${items.length})`}
            </button>
          )}
        </div>
      </Collapse>
    </div>
  );
};

const ProductListing = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [serverLastPage, setServerLastPage] = useState(null);
  const [serverTotal, setServerTotal] = useState(null);

  const [viewMode, setViewMode] = useState('list');
  const initialQuery = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(() => initialQuery.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => initialQuery.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(() => new URLSearchParams(location.search).get('category_id') || null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('Any');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const { i18n } = useTranslation();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const hasClientFilters = selectedBrands.length > 0 || selectedFeatures.length > 0 || selectedCondition !== 'Any' || verifiedOnly;
  const pageToFetch = hasClientFilters ? 1 : currentPage;

  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryCategory = query.get('category_id') || null;
    const querySearch = query.get('search') || '';
    // Route query parameters can change without remounting ProductListing.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategory(queryCategory);
    setSearchTerm(querySearch);
    setDebouncedSearch(querySearch);
  }, [location.search]);

  useEffect(() => {
    const categoryUrl = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CATEGORY}`;
    fetch(categoryUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json", Accept: "application/json" }
    })
      .then(response => {
        if (!response.ok) throw new Error("حدث خطأ في جلب التصنيفات");
        return response.json();
      })
      .then(data => {
        const root = data?.data ?? data;
        const list = Array.isArray(root) ? root : (root?.data || []);
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (selectedCategory !== null) params.append('category_id', selectedCategory);
    if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());

    if (priceFrom !== '' && Number.isFinite(Number(priceFrom))) params.append('price_from', priceFrom);
    if (priceTo !== '' && Number.isFinite(Number(priceTo))) params.append('price_to', priceTo);

    const sort = SORT_OPTIONS[sortBy];
    if (sort?.order_by) {
      params.append('order_by', sort.order_by);
      params.append('order', sort.order);
    }
    params.append('page', pageToFetch);

    const query = params.toString();
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT}${query ? `?${query}` : ''}`;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal
    })
      .then(response => {
        if (!response.ok) throw new Error("حدث خطأ في جلب المنتجات");
        return response.json();
      })
      .then(async (data) => {
        const readPage = (payload) => {
          const root = payload?.data ?? payload;
          const isArray = Array.isArray(root);
          const items = isArray ? root : root?.data;
          const meta = isArray ? (payload?.meta || payload) : (root?.meta || root);
          return {
            items: Array.isArray(items) ? items : [],
            lastPage: Number(meta?.last_page ?? payload?.meta?.last_page ?? 0),
            total: meta?.total ?? payload?.meta?.total,
          };
        };
        const firstPage = readPage(data);
        let productsArray = firstPage.items;
        // Brand/features/condition/shipping have no documented API parameters in this backend.
        // When any are selected, fetch all matching server-side pages so local filters are accurate.
        if (hasClientFilters && firstPage.lastPage > 1) {
          const remainingPages = await Promise.all(Array.from({ length: firstPage.lastPage - 1 }, async (_, index) => {
            const pageParams = new URLSearchParams(params);
            pageParams.set('page', String(index + 2));
            const pageResponse = await fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT}?${pageParams.toString()}`, {
              method: 'GET',
              headers: { Accept: 'application/json' },
              signal: controller.signal,
            });
            if (!pageResponse.ok) throw new Error('حدث خطأ في جلب المنتجات');
            const pagePayload = await pageResponse.json();
            return readPage(pagePayload).items;
          }));
          productsArray = firstPage.items.concat(...remainingPages);
        }

        const uniqueProducts = productsArray.filter((v, i, a) => a.findIndex(t => String(t.id) === String(v.id)) === i);
        setServerLastPage(hasClientFilters ? null : (firstPage.lastPage > 0 ? firstPage.lastPage : null));
        setServerTotal(firstPage.total !== undefined && firstPage.total !== null && Number.isFinite(Number(firstPage.total)) ? Number(firstPage.total) : null);

        const formattedProducts = uniqueProducts.map((item) => ({
          ...item,
          id: item.id,
          title: i18n.language === 'ar' ? (item.ar?.name || item.name || item.en?.name) : (item.en?.name || item.name || item.ar?.name),
          price: Number(item.price) || 0,
          description: i18n.language === 'ar' ? (item.ar?.description || item.description || item.en?.description) : (item.en?.description || item.description || item.ar?.description),
          imageSources: getImageCandidates(item.image ?? item.avatar ?? item.images),
          categoryId: item.category_id || (item.category && item.category.id),
          freeShipping: Boolean(item.free_shipping || item.is_free_shipping || item.freeShipping),
          brand: typeof item.brand === 'string' ? item.brand : (item.brand?.name || item.brand?.title || null),
          features: item.features || [],
          condition: item.condition || 'Any'
        }));

        setProducts(formattedProducts);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error("Error fetching products:", err);
        setProducts([]);
        setError("Something went wrong while loading products.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedCategory, debouncedSearch, priceFrom, priceTo, sortBy, reloadKey, pageToFetch, hasClientFilters, i18n.language]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedCategory, selectedBrands, selectedFeatures, selectedCondition, priceFrom, priceTo, verifiedOnly, sortBy, debouncedSearch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleSelection = (item, setList) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (selectedFeatures.length > 0 && !(Array.isArray(product.features) && product.features.some(f => selectedFeatures.includes(typeof f === 'string' ? f : f?.name)))) return false;
      if (selectedCondition !== 'Any' && product.condition !== selectedCondition) return false;
      if (priceFrom !== '' && Number(product.price) < Number(priceFrom)) return false;
      if (priceTo !== '' && Number(product.price) > Number(priceTo)) return false;
      if (debouncedSearch.trim()) {
        const haystack = `${product.title || ''} ${product.description || ''}`.toLocaleLowerCase();
        if (!haystack.includes(debouncedSearch.trim().toLocaleLowerCase())) return false;
      }
      if (selectedCategory !== null && String(product.categoryId) !== String(selectedCategory)) return false;
      if (verifiedOnly && !product.freeShipping) return false;
      return true;
    });
  }, [products, selectedBrands, selectedFeatures, selectedCondition, priceFrom, priceTo, debouncedSearch, selectedCategory, verifiedOnly]);

  const totalPages = serverLastPage ?? Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentProducts = useMemo(() => {
    if (serverLastPage) return filteredProducts;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, serverLastPage]);

  const pageStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => pageStart + i);

  const itemsCount = serverTotal !== null && !hasClientFilters ? serverTotal : filteredProducts.length;

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setSelectedCondition('Any');
    setPriceFrom('');
    setPriceTo('');
    setVerifiedOnly(false);
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const renderFilterSidebarContent = () => (
    <div className="bg-white rounded-3 border pl-border">
      <div className="p-3 border-bottom">
        <div
          className="d-flex justify-content-between align-items-center fw-semibold text-dark mb-2"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <span>Category</span>
          {categoryOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        <Collapse in={categoryOpen}>
          <ul className="list-unstyled mb-0 text-secondary small">
            <li
              className={`py-1 cursor-pointer fw-medium ${selectedCategory === null ? 'text-danger' : ''}`}
              style={{ cursor: 'pointer', color: selectedCategory === null ? MAIN_COLOR : 'inherit' }}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </li>
            {categories.map(cat => (
              <li
                key={cat.id}
                className={`py-1 cursor-pointer ${selectedCategory === cat.id ? 'fw-bold' : ''}`}
                style={{ cursor: 'pointer', color: selectedCategory === cat.id ? MAIN_COLOR : 'inherit' }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {i18n.language === 'ar' ? (cat.ar?.name || cat.name || cat.en?.name) : (cat.en?.name || cat.name || cat.ar?.name)}
              </li>
            ))}
          </ul>
        </Collapse>
      </div>

      {Array.from(new Set(products.map((p) => typeof p.brand === 'string' ? p.brand : p.brand?.name).filter(Boolean))).length > 0 && (
        <CollapsibleFilterGroup
          title="Brands"
          items={Array.from(new Set(products.map((p) => typeof p.brand === 'string' ? p.brand : p.brand?.name).filter(Boolean)))}
          selected={selectedBrands}
          onToggle={(b) => toggleSelection(b, setSelectedBrands)}
        />
      )}

      {Array.from(new Set(products.flatMap((p) => Array.isArray(p.features) ? p.features.map((f) => typeof f === 'string' ? f : f?.name).filter(Boolean) : []))).length > 0 && (
        <CollapsibleFilterGroup
          title="Features"
          items={Array.from(new Set(products.flatMap((p) => Array.isArray(p.features) ? p.features.map((f) => typeof f === 'string' ? f : f?.name).filter(Boolean) : [])))}
          selected={selectedFeatures}
          onToggle={(f) => toggleSelection(f, setSelectedFeatures)}
        />
      )}

      <div className="p-3 border-bottom">
        <div
          className="d-flex justify-content-between align-items-center fw-semibold text-dark mb-2"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setPriceOpen(!priceOpen)}
        >
          <span>Price range</span>
          {priceOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        <Collapse in={priceOpen}>
          <div>
            <Row className="g-2">
              <Col xs={6}>
                <Form.Label className="small text-muted mb-1">From</Form.Label>
                <Form.Control
                  type="number" min="0" size="sm" className="pl-input"
                  aria-label="Minimum price" placeholder="Min"
                  value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)}
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted mb-1">To</Form.Label>
                <Form.Control
                  type="number" min="0" size="sm" className="pl-input"
                  aria-label="Maximum price" placeholder="Max"
                  value={priceTo} onChange={(e) => setPriceTo(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </Collapse>
      </div>

      {Array.from(new Set(products.map((p) => p.condition).filter((value) => value && value !== 'Any'))).length > 0 && (
        <CollapsibleFilterGroup
          title="Condition"
          items={['Any', ...Array.from(new Set(products.map((p) => p.condition).filter((value) => value && value !== 'Any')))]}
          type="radio"
          selected={selectedCondition}
          onToggle={setSelectedCondition}
        />
      )}

      <div className="p-3 text-center">
        <Button
          variant="outline-danger"
          size="sm"
          className="w-100 fw-medium pl-outline-btn"
          onClick={resetFilters}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <style>{`
        .form-check-input:checked {
          background-color: ${MAIN_COLOR} !important;
          border-color: ${MAIN_COLOR} !important;
        }
        .form-check-input:focus,
        .form-select:focus,
        .form-control:focus {
          border-color: ${MAIN_COLOR} !important;
          box-shadow: 0 0 0 0.25rem rgba(241, 59, 99, 0.25) !important;
        }
        .pl-input { border-color: ${MAIN_COLOR} !important; }
        .pl-border { border-color: ${MAIN_COLOR} !important; }
        .btn.pl-outline-btn {
          --bs-btn-color: ${MAIN_COLOR};
          --bs-btn-border-color: ${MAIN_COLOR};
          --bs-btn-hover-color: #fff;
          --bs-btn-hover-bg: ${MAIN_COLOR};
          --bs-btn-hover-border-color: ${MAIN_COLOR};
          --bs-btn-active-color: #fff;
          --bs-btn-active-bg: ${MAIN_COLOR};
          --bs-btn-active-border-color: ${MAIN_COLOR};
        }
        .heart-pop { animation: heartPop 0.45s ease; }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.4); }
          60%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .heart-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          margin: -3px 0 0 -3px;
          border-radius: 50%;
          background: ${MAIN_COLOR};
          pointer-events: none;
          animation: heartBurst 0.6s ease-out forwards;
        }
        @keyframes heartBurst {
          0%   { transform: rotate(var(--angle)) translateY(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--angle)) translateY(-26px) scale(0.3); opacity: 0; }
        }
        /* ✅ Skeleton Loading Animation */
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      <MainNavbar />
      <Container className="py-4">
        <div className="d-md-none mb-3 d-flex justify-content-between align-items-center bg-white p-3 rounded-3 border shadow-sm">
          <span className="fw-bold text-dark">{itemsCount} Items</span>
          <Button
            variant="outline-danger"
            size="sm"
            className="d-flex align-items-center gap-2 pl-outline-btn"
            onClick={() => setShowMobileFilter(true)}
          >
            <FiFilter /> Filters
          </Button>
        </div>

        <Row className="g-4">
          <Col md={4} lg={3} className="d-none d-md-block">
            {renderFilterSidebarContent()}
          </Col>

          <Col lg={9} md={8}>
            <div className="bg-white rounded-3 border p-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-3 shadow-sm">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">{itemsCount}</span>
                <span className="text-muted">items found</span>
              </div>

              <div className="d-flex align-items-center gap-3 flex-grow-1 justify-content-md-end flex-wrap">
                <div className="position-relative" style={{ maxWidth: '220px', width: '100%' }}>
                  <FiSearch className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <Form.Control
                    type="text" placeholder=" Search products..." size="sm"
                    className="ps-4 pl-input"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Form.Check
                  type="checkbox"
                  id="verified-only"
                  label="Free Shipping"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="text-dark small m-0 cursor-pointer d-none d-lg-block"
                />

                <Form.Select
                  size="sm"
                  className="pl-input"
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                    <option key={key} value={key}>{opt.label}</option>
                  ))}
                </Form.Select>

                <ButtonGroup size="sm">
                  <Button variant="light" className={`border ${viewMode === 'grid' ? 'bg-secondary-subtle' : 'bg-white'}`} onClick={() => setViewMode('grid')}><FiGrid size={18} /></Button>
                  <Button variant="light" className={`border ${viewMode === 'list' ? 'bg-secondary-subtle' : 'bg-white'}`} onClick={() => setViewMode('list')}><FiList size={18} /></Button>
                </ButtonGroup>
              </div>
            </div>

            {loading ? (
              //  Skeleton Loading
              <Row className="g-2 g-md-3">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <Col key={n} xs={6} lg={4}>
                    <SkeletonCard />
                  </Col>
                ))}
              </Row>
            ) : error ? (
              <div className="bg-white rounded-3 border p-5 text-center my-4 shadow-sm">
                <h5 className="text-muted">{error}</h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-3 pl-outline-btn"
                  onClick={() => setReloadKey(k => k + 1)}
                >
                  Try again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3 border p-5 text-center my-4 shadow-sm">
                <h5 className="text-muted">No products match your criteria.</h5>
                <p className="text-secondary small mb-3">Try adjusting your filters or search term.</p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="pl-outline-btn"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              viewMode === 'list' ? (
                <div className="d-flex flex-column">
                  {currentProducts.map(product => <ProductListCard key={product.id} product={product} />)}
                </div>
              ) : (
                <Row className="g-2 g-md-3">
                  {currentProducts.map(product => (
                    <Col key={product.id} xs={6} lg={4}>
                      <ProductGridCard product={product} />
                    </Col>
                  ))}
                </Row>
              )
            )}

            {/*\Pagination \ */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-4 bg-white p-3 rounded-4 border shadow-sm flex-wrap">
                <span className="text-muted small">
                  Page <b>{currentPage}</b> of <b>{totalPages}</b>
                </span>
                <ButtonGroup size="sm" className="shadow-sm">
                  <Button
                    variant="light"
                    className="border fw-bold"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{ borderRadius: '8px 0 0 8px' }}
                  >
                    <FiChevronLeft />
                  </Button>
                  {pageNumbers.map(n => (
                    <Button
                      key={n}
                      variant={n === currentPage ? 'danger' : 'light'}
                      className={`border fw-bold ${n === currentPage ? 'text-white' : 'text-dark'}`}
                      style={n === currentPage ? { backgroundColor: MAIN_COLOR, borderColor: MAIN_COLOR } : {}}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </Button>
                  ))}
                  <Button
                    variant="light"
                    className="border fw-bold"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  >
                    <FiChevronRight />
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Offcanvas show={showMobileFilter} onHide={() => setShowMobileFilter(false)} placement="start">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fs-6 fw-bold">Filter Products</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-2">
          {renderFilterSidebarContent()}
        </Offcanvas.Body>
      </Offcanvas>

      <Footer onSubscribe={(email) => console.log('Subscribed:', email)} />
    </div>
  );
};

export default ProductListing;