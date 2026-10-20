import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { MdPlayArrow } from 'react-icons/md';
import { FiLogOut, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Navbarpayment from '../PaymentMethod/Navbarpayment';
import PageBanner from './PageBanner';
import './SharedPages.css';
import { API_Config } from '../../Config/API-Config';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const CUSTOMER_ENDPOINT = `${API_Config.BASE_URL}/customer`;

const customerFromResponse = (payload) => payload?.data?.customer || payload?.data?.user || payload?.data || payload?.customer || payload;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [user, setUser] = useState(() => ({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('phone') || '',
    image: localStorage.getItem('userImage') || '',
  }));
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const label = (en, ar) => i18n.language === 'ar' ? ar : en;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true, state: { authRequired: true, attemptedPath: '/ProfilePage' } });
      return undefined;
    }

    const controller = new AbortController();
    fetch(CUSTOMER_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          throw new Error('SESSION_EXPIRED');
        }
        if (!response.ok) throw new Error(payload?.message || 'Could not load your profile.');
        return payload;
      })
      .then((payload) => {
        const customer = customerFromResponse(payload);
        if (!customer || typeof customer !== 'object') return;
        setUser((previous) => {
          const merged = {
            name: localStorage.getItem('userName') || customer.name || previous.name,
            email: localStorage.getItem('userEmail') || customer.email || previous.email,
            phone: customer.phone ?? previous.phone,
            image: customer.image ?? previous.image,
          };
          if (merged.name) localStorage.setItem('userName', merged.name);
          if (merged.email) localStorage.setItem('userEmail', merged.email);
          if (merged.phone) localStorage.setItem('phone', merged.phone);
          if (merged.image) localStorage.setItem('userImage', merged.image);
          return merged;
        });
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return;
        if (fetchError.message === 'SESSION_EXPIRED') {
          ['token', 'userName', 'userEmail', 'phone', 'userImage'].forEach((key) => localStorage.removeItem(key));
          window.dispatchEvent(new Event('customer-auth-changed'));
          navigate('/', { replace: true, state: { authRequired: true, attemptedPath: '/ProfilePage' } });
        } else {
          console.error('Fetch customer error:', fetchError);
          setError(fetchError.message || 'Could not load your profile.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [navigate, i18n.language]);

  const handleLogout = () => {
    ['token', 'redirectAfterLogin', 'userName', 'userEmail', 'phone', 'userImage'].forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new Event('customer-auth-changed'));
    navigate('/');
  };

  const beginEditing = () => {
    setError('');
    setSuccess('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setUser({
      name: localStorage.getItem('userName') || user.name,
      email: localStorage.getItem('userEmail') || user.email,
      phone: localStorage.getItem('phone') || user.phone,
      image: localStorage.getItem('userImage') || user.image,
    });
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  const handleUserChange = (field, value) => {
    setUser((previous) => ({ ...previous, [field]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!user.name.trim()) {
      setError(label('Please enter your full name.', 'يرجى إدخال الاسم الكامل.'));
      return;
    }
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      setError(label('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صحيح.'));
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true, state: { authRequired: true, attemptedPath: '/ProfilePage' } });
      return;
    }

    const body = JSON.stringify({ name: user.name.trim(), email: user.email.trim(), phone: user.phone.trim() });
    const requests = [
      { url: CUSTOMER_ENDPOINT, method: 'PUT' },
      { url: CUSTOMER_ENDPOINT, method: 'PATCH' },
      { url: `${CUSTOMER_ENDPOINT}/update`, method: 'POST' },
    ];

    setSaving(true);
    try {
      let savedPayload = null;
      let lastRouteError = null;
      for (const request of requests) {
        const response = await fetch(request.url, {
          method: request.method,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body,
        });
        const payload = await response.json().catch(() => ({}));
        if (response.ok) {
          savedPayload = payload;
          break;
        }
        if ([404, 405, 501].includes(response.status)) {
          lastRouteError = new Error(payload?.message || 'The profile update route is not available on the server.');
          continue;
        }
        const validationMessages = payload?.errors ? Object.values(payload.errors).flat().join(' ') : '';
        throw new Error(validationMessages || payload?.message || label('Failed to save profile changes.', 'تعذّر حفظ تعديلات الحساب.'));
      }
      if (!savedPayload) throw lastRouteError || new Error(label('Profile updates are not supported by the API.', 'واجهة البرمجة لا تدعم تعديل الحساب حاليًا.'));

      const savedUser = customerFromResponse(savedPayload);
      const updated = {
        name: savedUser?.name ?? user.name.trim(),
        email: savedUser?.email ?? user.email.trim(),
        phone: savedUser?.phone ?? user.phone.trim(),
        image: savedUser?.image ?? user.image,
      };
      setUser(updated);
      if (updated.name) localStorage.setItem('userName', updated.name);
      if (updated.email) localStorage.setItem('userEmail', updated.email);
      if (updated.phone) localStorage.setItem('phone', updated.phone);
      if (updated.image) localStorage.setItem('userImage', updated.image);
      setIsEditing(false);
      setSuccess(label('Your profile has been updated.', 'تم تحديث بيانات حسابك بنجاح.'));
    } catch (saveError) {
      setError(saveError.message || label('Failed to save profile changes.', 'تعذّر حفظ تعديلات الحساب.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = (linkName) => {
    if (linkName === 'Terms and condition') navigate('/TermsPage');
    if (linkName === 'Contact us page') navigate('/ContactPage');
  };

  const settingsLinks = [
    'Wishlist page', 'About us page', 'Contact us page', 'FAQ page', 'Terms and condition', 'Privacy Policy page',
  ];

  if (loading) {
    return (
      <>
        <Navbarpayment />
        <Container className="profile-loading-page">
          <div className="profile-loader" role="status" aria-label={label('Loading profile', 'جارٍ تحميل الملف الشخصي')}>
            <span className="profile-loader-ring" />
            <span className="profile-loader-dot" />
          </div>
          <p>{label('Loading your profile…', 'جارٍ تحميل بيانات حسابك…')}</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbarpayment />
      <Container>
        <div className="page-white-container">
          <PageBanner showBack={false} />
          <div className="profile-header">
            <img
              src={user.image || DEFAULT_AVATAR}
              alt={label('Profile photo', 'الصورة الشخصية')}
              className="avatar-img"
              onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = DEFAULT_AVATAR; }}
            />
            <div className="flex-grow-1">
              <h5 className="mb-1 fw-bold" style={{ color: 'var(--text-main)' }}>{user.name || label('Guest User', 'مستخدم')}</h5>
              <p className="mb-0" style={{ color: 'var(--text-muted)' }}>{user.email || label('No email', 'لا يوجد بريد إلكتروني')}</p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {!isEditing ? (
                <Button variant="outline-danger" size="sm" onClick={beginEditing} className="d-flex align-items-center gap-2" style={{ borderColor: '#f13b63', color: '#f13b63' }}>
                  <FiEdit2 /> {label('Edit profile', 'تعديل الملف الشخصي')}
                </Button>
              ) : (
                <>
                  <Button type="submit" form="edit-profile-form" size="sm" disabled={saving} className="d-flex align-items-center gap-2" style={{ backgroundColor: '#f13b63', borderColor: '#f13b63' }}>
                    <FiCheck /> {saving ? label('Saving…', 'جارٍ الحفظ…') : label('Save changes', 'حفظ التعديلات')}
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={cancelEditing} disabled={saving} className="d-flex align-items-center gap-2">
                    <FiX /> {label('Cancel', 'إلغاء')}
                  </Button>
                </>
              )}
              <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2" style={{ borderColor: '#f13b63', color: '#f13b63' }}>
                <FiLogOut /> {label('Logout', 'تسجيل الخروج')}
              </Button>
            </div>
          </div>

          {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
          {success && <div className="alert alert-success mt-3" role="status">{success}</div>}

          <Form id="edit-profile-form" onSubmit={handleSaveProfile}>
            <Row className="mb-4">
              <Col md={4} className="profile-input-group mb-3">
                <Form.Label>{label('Full name', 'الاسم الكامل')}</Form.Label>
                <Form.Control type="text" value={user.name} onChange={(event) => handleUserChange('name', event.target.value)} className="profile-input" readOnly={!isEditing} required />
              </Col>
              <Col md={4} className="profile-input-group mb-3">
                <Form.Label>{label('Email', 'البريد الإلكتروني')}</Form.Label>
                <Form.Control type="email" value={user.email} onChange={(event) => handleUserChange('email', event.target.value)} className="profile-input" readOnly={!isEditing} />
              </Col>
              <Col md={4} className="profile-input-group mb-3">
                <Form.Label>{label('Phone', 'رقم الهاتف')}</Form.Label>
                <Form.Control type="tel" value={user.phone} onChange={(event) => handleUserChange('phone', event.target.value)} className="profile-input" readOnly={!isEditing} />
              </Col>
            </Row>
          </Form>

          <Form.Label className="mb-3 d-block" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {label('Settings', 'الإعدادات')}
          </Form.Label>
          <Row>
            {settingsLinks.map((link, index) => (
              <Col md={4} key={index}>
                <div className="setting-card" role="button" tabIndex={0} onClick={() => handleCardClick(link)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleCardClick(link); }}>
                  <span>{label(link, ({
                    'Wishlist page': 'قائمة المفضلة',
                    'About us page': 'من نحن',
                    'Contact us page': 'اتصل بنا',
                    'FAQ page': 'الأسئلة الشائعة',
                    'Terms and condition': 'الشروط والأحكام',
                    'Privacy Policy page': 'سياسة الخصوصية',
                  })[link])}</span>
                  <MdPlayArrow color="#ed355a" size={20} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default ProfilePage;
