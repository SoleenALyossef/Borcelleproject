import { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useNavigate } from 'react-router';
const CategoriesList = () => {
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(() => {
    setLoading(true);
    setError('');

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then((data) => {
        const items = data?.data?.data || data?.data || data || [];
        setList(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCategories();
    }
  }, [adminToken, fetchCategories]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category?')) return;

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete category');
        window.dispatchEvent(new CustomEvent('admin:data-changed', { detail: { type: 'category', action: 'delete' } }));
        fetchCategories();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-page-title m-0">Categories</h2>
        <div className="d-flex gap-2">
          <button className="admin-btn-primary bg-light text-dark border" onClick={fetchCategories}>
            <FiRefreshCw /> Refresh
          </button>
          <button 
          className="admin-btn-primary" 
          onClick={() => navigate('/admin/categories/new')}
        >
          <FiPlus /> Add Category
        </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading categories...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-5 text-muted">No categories found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name (EN)</th>
                <th>Name (AR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.name || c.en?.name || 'N/A'}</td>
                  <td dir="rtl">{c.ar?.name || 'N/A'}</td>
                  <td className="admin-actions">
                    <button 
                      className="edit" 
                      onClick={() => navigate(`/admin/categories/edit/${c.id}`)}
                    >
                      <FiEdit2 size={12} />
                    </button>
                    <button className="delete" onClick={() => handleDelete(c.id)}>
                      <FiTrash2 size={12} />
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

export default CategoriesList;