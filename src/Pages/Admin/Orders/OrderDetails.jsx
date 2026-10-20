import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';
import { localizedName } from '../../../i18n/localizedFields';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const { i18n } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!adminToken || !id) return;
    setLoading(true);
    setError('');

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.ORDER}/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch order details');
        return res.json();
      })
      .then((data) => {
        const o = data?.data || data;
        setOrder(o);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, adminToken]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-card text-center py-5">
        <h5 className="text-muted">{error || 'Order not found'}</h5>
        <button className="admin-btn-primary mt-3" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
      </div>
    );
  }

  const items = order.items || order.order_items || [];

  return (
    <div>
      <div className="admin-header-row">
        <button
          className="admin-btn-primary"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Back
        </button>
        <h2 className="admin-page-title m-0">Order #{order.id}</h2>
      </div>

      <div className="admin-card mb-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <FiPackage size={18} color="#f13b63" />
            <span><strong>Status:</strong> {order.status || 'Pending'}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FiCalendar size={18} color="#f13b63" />
            <span><strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FiCreditCard size={18} color="#f13b63" />
            <span><strong>Payment:</strong> {order.payment_type || 'CASH'}</span>
          </div>
        </div>
      </div>

      {order.address && (
        <div className="admin-card mb-3">
          <h6 className="fw-bold mb-2"><FiMapPin /> Shipping Address</h6>
          <p className="mb-0 text-muted">
            {order.address.city}, {order.address.street}, {order.address.building}
          </p>
        </div>
      )}

      <div className="admin-card">
        <h6 className="fw-bold mb-3">Items ({items.length})</h6>
        {items.length === 0 ? (
          <p className="text-muted">No items found for this order.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const product = item.product || item;
                const price = parseFloat(product.price || item.price || 0);
                const qty = item.quantity || 1;

                return (
                  <tr key={idx}>
                    <td>
                      <img
                        src={product.image || 'https://via.placeholder.com/40'}
                        alt={localizedName(product, i18n.language, 'Product')}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{localizedName(product, i18n.language, 'Product')}</td>
                    <td>{qty}</td>
                    <td>{price.toFixed(2)} AED</td>
                    <td>{(price * qty).toFixed(2)} AED</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-end fw-bold">Total:</td>
                <td className="fw-bold" style={{ color: '#f13b63' }}>
                  {parseFloat(order.total || 0).toFixed(2)} AED
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;