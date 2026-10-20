import React, { useEffect, useState } from 'react';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const OrdersList = () => {
  const { adminToken } = useAdminAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    setError('');

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.ORDER}`, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        const items = data?.data?.data || data?.data || data || [];
        setList(Array.isArray(items) ? items : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (adminToken) fetchOrders();
  }, [adminToken]);

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-page-title m-0">Orders</h2>
        <button className="admin-btn-primary bg-light text-dark border" onClick={fetchOrders}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-5 text-muted">No orders found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer?.name || 'N/A'}</td>
                  <td>{o.total || 0} AED</td>
                  <td>{o.status || 'Pending'}</td>
                  <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="admin-actions">
                    <button className="edit" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <FiEye size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersList;