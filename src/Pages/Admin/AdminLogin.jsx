import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FiMail, FiLock, FiGlobe } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AuthLayout from '../../components/AuthLayout';
import { useTranslation } from 'react-i18next';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { i18n } = useTranslation();


  const [email, setEmail] = useState('admin@candy.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    login(email, password)
      .then(() => {
        navigate('/admin');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout>
      <div className="d-flex justify-content-end mb-3"><button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}><FiGlobe /> {i18n.language === 'ar' ? 'English' : 'العربية'}</button></div>
      <h3 className="form-title">Admin Login</h3>
      <p className="form-subtitle">Sign in to your dashboard</p>

      <Form onSubmit={handleSubmit}>
        <InputGroup className="custom-input-group mb-3">
          <Form.Control
            type="email"
            placeholder="Admin email"
            className="custom-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputGroup.Text className="custom-input-icon">
            <FiMail />
          </InputGroup.Text>
        </InputGroup>

        <InputGroup className="custom-input-group mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            className="custom-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputGroup.Text className="custom-input-icon">
            <FiLock />
          </InputGroup.Text>
        </InputGroup>

        {error && <div className="text-danger small alert alert-warning">{error}</div>}

        <Button
          type="submit"
          disabled={loading}
          className="btn-primary-custom w-100 mt-3 mb-4"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default AdminLogin;