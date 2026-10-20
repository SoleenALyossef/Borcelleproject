import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { adminToken } = useAdminAuth();
  const { i18n } = useTranslation();
  const label = (en, ar) => i18n.language === 'ar' ? ar : en;
  const isEdit = !!id;

  const [form, setForm] = useState({
    en: { name: '' },
    ar: { name: '' },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${adminToken}`,
  }), [adminToken]);

  // جلب بيانات التصنيف في حال التعديل
  useEffect(() => {
    if (isEdit && adminToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFetching(true);
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}/${id}`, {
        headers: getHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          const c = data?.data || data;
          if (c) {
            setForm({
              en: { name: c.en?.name || c.name || '' },
              ar: { name: c.ar?.name || '' },
            });
          }
        })
        .catch((err) => console.error('Fetch category error:', err))
        .finally(() => setFetching(false));
    } else {
      setFetching(false);
    }
  }, [id, isEdit, adminToken, getHeaders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isEdit
      ? `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}/${id}`
      : `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}`;
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Something went wrong');
          });
        }
        return res.json();
      })
      .then(() => {
        window.dispatchEvent(new CustomEvent('admin:data-changed', { detail: { type: 'category', action: isEdit ? 'update' : 'create' } }));
        navigate('/admin/categories');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: '#f13b63' }} />
        <p className="mt-2">{label('Loading...', 'جارٍ التحميل...')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header-row">
        <button
          className="admin-btn-primary"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> {label('Back', 'رجوع')}
        </button>
        <h2 className="admin-page-title m-0">{isEdit ? label('Edit Category', 'تعديل التصنيف') : label('New Category', 'إضافة تصنيف')}</h2>
      </div>

      <Form className="admin-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <Row className="g-3">
          <Col md={6}>
            <h6 className="mt-2 fw-bold">{label('English', 'الإنجليزية')}</h6>
            <Form.Label>{label('Name (EN)', 'الاسم بالإنجليزية')}</Form.Label>
            <Form.Control
              value={form.en.name}
              onChange={(e) => setForm({ ...form, en: { name: e.target.value } })}
              required
            />
          </Col>
          <Col md={6}>
            <h6 className="mt-2 fw-bold">العربية</h6>
            <Form.Label>{label('Name (AR)', 'الاسم بالعربية')}</Form.Label>
            <Form.Control
              value={form.ar.name}
              onChange={(e) => setForm({ ...form, ar: { name: e.target.value } })}
              dir="rtl"
              required
            />
          </Col>
        </Row>

        <div className="mt-4">
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? (
              <><Spinner as="span" animation="border" size="sm" className="me-2" />{label('Saving...', 'جارٍ الحفظ...')}</>
            ) : (
              <><FiSave /> {isEdit ? label('Update', 'تحديث') : label('Save', 'حفظ')}</>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryForm;