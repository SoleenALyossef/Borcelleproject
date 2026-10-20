import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { API_Config } from '../../../Config/API-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../../i18n/localizedFields';

const API_ROOT = AdminAPI_Config.BASE_URL.replace(/\/api\/?$/, '');

const resolveProductImage = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const path = raw && typeof raw === 'object' ? (raw.url || raw.path || raw.image) : raw;
  if (typeof path !== 'string' || !path) return 'https://via.placeholder.com/50';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const clean = path.replace(/^\/+/, '');
  return clean.startsWith('storage/') ? `${API_ROOT}/${clean}` : `${API_ROOT}/storage/${clean}`;
};

const findItems = (payload, depth = 0) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object' || depth > 5) return [];
  for (const key of ['data', 'products', 'items', 'results', 'records']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  for (const key of ['data', 'result', 'payload']) {
    if (payload[key] && typeof payload[key] === 'object') {
      const items = findItems(payload[key], depth + 1);
      if (items.length) return items;
    }
  }
  return [];
};

const findPagination = (payload, depth = 0) => {
  if (!payload || typeof payload !== 'object' || depth > 5) return {};
  const lastPage = payload.last_page ?? payload.lastPage ?? payload.pagination?.last_page ?? payload.meta?.last_page;
  const total = payload.total ?? payload.meta?.total ?? payload.pagination?.total;
  const perPage = payload.per_page ?? payload.perPage ?? payload.meta?.per_page ?? payload.pagination?.per_page;
  if (lastPage !== undefined || total !== undefined || perPage !== undefined) return { lastPage: Number(lastPage) || 0, total: Number(total), perPage: Number(perPage) || 100 };
  for (const key of ['data', 'result', 'payload']) {
    const result = findPagination(payload[key], depth + 1);
    if (Object.keys(result).length) return result;
  }
  return {};
};

const fetchAllFromEndpoint = async (endpoint, headers) => {
  const urlForPage = (page) => `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}&per_page=100&_=${Date.now()}`;
  const firstResponse = await fetch(urlForPage(1), { method: 'GET', headers, cache: 'no-store' });
  const firstPayload = await firstResponse.json().catch(() => ({}));
  if (!firstResponse.ok) throw new Error(firstPayload?.message || `Failed to fetch ${endpoint}`);

  const firstItems = findItems(firstPayload);
  const pageInfo = findPagination(firstPayload);
  const inferredPages = pageInfo.lastPage || (pageInfo.total > 0 ? Math.ceil(pageInfo.total / (pageInfo.perPage || 100)) : 1);
  const pageCount = Math.min(Math.max(inferredPages || 1, 1), 50);
  if (pageCount <= 1) return firstItems;

  const laterPages = await Promise.all(Array.from({ length: pageCount - 1 }, async (_, index) => {
    const response = await fetch(urlForPage(index + 2), { method: 'GET', headers, cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return [];
    return findItems(payload);
  }));
  return firstItems.concat(...laterPages);
};

const uniqueById = (items) => {
  const byId = new Map();
  items.forEach((item) => {
    const id = item?.id ?? item?.product_id ?? item?._id;
    if (id === undefined || id === null) return;
    const key = String(id);
    byId.set(key, { ...(byId.get(key) || {}), ...item });
  });
  return [...byId.values()];
};

const ProductsList = () => {
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const { i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setError('');

    const headers = { Accept: 'application/json', Authorization: `Bearer ${adminToken}` };
    const endpoints = [
      `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}`,
      `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT}`,
    ];

    try {
      const results = await Promise.allSettled(endpoints.map((endpoint, index) =>
        fetchAllFromEndpoint(endpoint, index === 0 ? headers : { Accept: 'application/json' })
      ));
      const successfulCollections = results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
      if (successfulCollections.length === 0) {
        const failed = results.find((result) => result.status === 'rejected');
        throw failed?.reason || new Error('Could not load products from the API.');
      }
      setProducts(uniqueById(successfulCollections.flat()).sort((a, b) => {
        const aTime = new Date(a.created_at || a.createdAt || 0).getTime() || 0;
        const bTime = new Date(b.created_at || b.createdAt || 0).getTime() || 0;
        if (aTime && bTime && aTime !== bTime) return bTime - aTime;
        const aId = Number(a.id ?? a.product_id ?? 0);
        const bId = Number(b.id ?? b.product_id ?? 0);
        return Number.isFinite(aId) && Number.isFinite(bId) ? bId - aId : 0;
      }));
    } catch (err) {
      console.error('Products list fetch error:', err);
      setError(err.message || 'Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    const refresh = () => fetchProducts();
    window.addEventListener('admin:data-changed', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('admin:data-changed', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    const confirmText = i18n.language === 'ar' ? 'هل تريد حذف هذا المنتج؟' : 'Delete this product?';
    if (!window.confirm(confirmText)) return;
    try {
      const response = await fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json', Authorization: `Bearer ${adminToken}` },
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || 'Failed to delete product');
      }
      window.dispatchEvent(new CustomEvent('admin:data-changed', { detail: { type: 'product', action: 'delete' } }));
      await fetchProducts();
    } catch (err) {
      window.alert(err.message || 'Failed to delete product');
    }
  };

  const label = (en, ar) => i18n.language === 'ar' ? ar : en;

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-page-title m-0">{label('Products', 'المنتجات')}</h2>
        <div className="d-flex gap-2">
          <button className="admin-btn-primary bg-light text-dark border" onClick={fetchProducts} title={label('Refresh', 'تحديث')}>
            <FiRefreshCw /> {label('Refresh', 'تحديث')}
          </button>
          <button className="admin-btn-primary" onClick={() => navigate('/admin/products/new')}>
            <FiPlus /> {label('Add Product', 'إضافة منتج')}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="admin-loader" role="status" aria-label={label('Loading products', 'جارٍ تحميل المنتجات')} />
            <p className="mt-2">{label('Loading products from API…', 'جارٍ تحميل المنتجات من الخادم…')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 text-muted">
            {label('No products were returned by the API.', 'لم تُرجع واجهة البرمجة أي منتجات.')}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{label('Image', 'الصورة')}</th>
                  <th>{label('SKU', 'رمز المنتج')}</th>
                  <th>{label('Name', 'الاسم')}</th>
                  <th>{label('Price', 'السعر')}</th>
                  <th>{label('Category', 'التصنيف')}</th>
                  <th>{label('Actions', 'الإجراءات')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={resolveProductImage(product.image ?? product.images)}
                        alt={localizedName(product, i18n.language, 'Product')}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(event) => { event.currentTarget.src = 'https://via.placeholder.com/50'; }}
                      />
                    </td>
                    <td>{product.sku || product.id}</td>
                    <td>{localizedName(product, i18n.language, 'N/A')}</td>
                    <td>{Number.parseFloat(product.price || 0).toFixed(2)}</td>
                    <td>{product.category?.name || product.category_id || 'N/A'}</td>
                    <td className="admin-actions">
                      <button className="edit" title={label('Edit', 'تعديل')} onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                        <FiEdit2 size={12} />
                      </button>
                      <button className="delete" title={label('Delete', 'حذف')} onClick={() => handleDelete(product.id)}>
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
