import { Form, InputGroup } from 'react-bootstrap';
import { FiUser, FiMail, FiPhoneCall } from 'react-icons/fi';
import { HiOutlineCamera } from 'react-icons/hi';
import AuthLayout from '../../components/AuthLayout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { API_Config } from '../../Config/API-Config';

const ProfileInfoPage = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: localStorage.getItem('phone') || '',
    image: null,
    imagePreview: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //  إذا ما في token، نرجعه LoginPage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
    }
  }, [navigate]);

  const goToNextStep = () => {
    const redirect = localStorage.getItem('redirectAfterLogin');
    if (redirect) {
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirect);
    } else {
      navigate('/ProfilePage');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRegisterData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setRegisterData((prev) => ({ ...prev, imagePreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRegisteration = (e) => {
    e.preventDefault();
    setError('');

    //  تحقق من الاسم والإيميل
    if (!registerData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!registerData.email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);

    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.REGISTER}`;
    const formData = new FormData();
    formData.append('name', registerData.name);
    formData.append('email', registerData.email);
    formData.append('phone', registerData.phone);
    if (registerData.image) {
      formData.append('image', registerData.image);
    }

    fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            const e = new Error(err.message || 'Something went wrong');
            e.status = res.status;
            e.errors = err.errors;
            throw e;
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Register success:', data);

        const userData = data?.data || {};
        localStorage.setItem('userName', registerData.name.trim() || userData.name || '');
        localStorage.setItem('userEmail', registerData.email.trim() || userData.email || '');

        const imageUrl = userData.image || data?.image;
        if (imageUrl) {
          localStorage.setItem('userImage', imageUrl);
        } else if (registerData.imagePreview) {
          localStorage.setItem('userImage', registerData.imagePreview);
        }

        goToNextStep();
      })
      .catch((err) => {
        console.error('Register error:', err);

        const msg = (err.message || '').toLowerCase();
        const errors = err.errors || {};
        const phoneErr = (errors.phone?.[0] || '').toLowerCase();

        //  إذا الرقم مأخوذ → المستخدم قديم، نتجاوز
        if (
          err.status === 422 ||
          (msg.includes('phone') && (msg.includes('taken') || msg.includes('already'))) ||
          phoneErr.includes('taken') ||
          phoneErr.includes('already')
        ) {
          console.log('User already exists → skipping');

          // نحفظ معلوماته على أي حال
          localStorage.setItem('userName', registerData.name.trim());
          localStorage.setItem('userEmail', registerData.email.trim());
          if (registerData.imagePreview) {
            localStorage.setItem('userImage', registerData.imagePreview);
          }

          goToNextStep();
          return;
        }

        setError(err.message || 'Something went wrong');
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout>
      <h3 className="form-title">Fill your information</h3>
      <p className="form-subtitle mb-4">Enter your details</p>

      <Form onSubmit={handleRegisteration}>
        <div className="profile-upload-container mb-4">
          <label htmlFor="photo-upload" className="profile-upload-box shadow-sm">
            {registerData.imagePreview ? (
              <img
                src={registerData.imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
            ) : (
              <>
                <HiOutlineCamera size={26} color="#f13b63" />
                <span className="upload-text">Add photo</span>
              </>
            )}
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        {error && <div className="text-danger small alert alert-warning">{error}</div>}

        <InputGroup className="custom-input-group-auth mb-3">
          <Form.Control
            placeholder="Name..."
            className="custom-input-field"
            type="text"
            value={registerData.name}
            onInput={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            required
          />
          <InputGroup.Text className="custom-input-icon-side">
            <FiUser size={18} />
          </InputGroup.Text>
        </InputGroup>

        <InputGroup className="custom-input-group-auth mb-3">
          <Form.Control
            placeholder="Email"
            className="custom-input-field"
            type="email"
            value={registerData.email}
            onInput={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
          <InputGroup.Text className="custom-input-icon-side">
            <FiMail size={18} />
          </InputGroup.Text>
        </InputGroup>

        <InputGroup className="custom-input-group-auth mb-4">
          <Form.Control
            placeholder="Phone (09xxxxxxxx)"
            className="custom-input-field"
            type="tel"
            value={registerData.phone}
            onInput={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setRegisterData({ ...registerData, phone: val });
            }}
            required
          />
          <InputGroup.Text className="custom-input-icon-side">
            <FiPhoneCall size={18} />
          </InputGroup.Text>
        </InputGroup>

        <button
          className="btn-primary-custom w-100 text-center text-white text-decoration-none border-0"
          type="submit"
          disabled={loading}
          style={{ padding: '10px', borderRadius: '8px' }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </Form>
    </AuthLayout>
  );
};

export default ProfileInfoPage;