import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const MunicipalsList = () => {
  const { adminToken } = useAdminAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMunicipals = () => {
    setLoading(true);
    setError('');

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.MUNICIPAL}`, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch municipals');
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
    if (adminToken) fetchMunicipals();
  }, [adminToken]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this municipal?')) return;

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.MUNICIPAL}/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json', Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete municipal');
        fetchMunicipals();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-page-title m-0">Municipals</h2>
        <div className="d-flex gap-2">
          <button className="admin-btn-primary bg-light text-dark border" onClick={fetchMunicipals}>
            <FiRefreshCw /> Refresh
          </button>
          <button className="admin-btn-primary"><FiPlus /> Add Municipal</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading municipals...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-5 text-muted">No municipals found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>City ID</th>
                <th>Name (EN)</th>
                <th>Name (AR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id}>
                  <td>#{m.id}</td>
                  <td>#{m.city_id}</td>
                  <td>{m.name || m.en?.name || 'N/A'}</td>
                  <td dir="rtl">{m.ar?.name || 'N/A'}</td>
                  <td className="admin-actions">
                    <button className="edit"><FiEdit2 size={12} /></button>
                    <button className="delete" onClick={() => handleDelete(m.id)}>
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

export default MunicipalsList;