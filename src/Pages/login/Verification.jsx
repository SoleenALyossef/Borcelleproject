import AuthLayout from "../../components/AuthLayout";
import { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { API_Config } from '../../Config/API-Config';

const Verification = () => {
  const navigate = useNavigate();
  const phone = localStorage.getItem("phone") || "";

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(55);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (timer > 0 || resendLoading) return;
    setError("");
    setSuccess("");
    setResendLoading(true);

    fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.RESEND}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ phone }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => {
            throw new Error(e.message || "Resend failed");
          });
        }
        return res.json();
      })
      .then(() => {
        setTimer(55);
        setOtp(['', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setSuccess("Code sent successfully");
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setResendLoading(false));
  };

  // بعد نجاح OTP → نتحقق إذا المستخدم قديم أو جديد
  const checkUserAndRedirect = (token) => {
    const redirect = localStorage.getItem('redirectAfterLogin');

    fetch(`${API_Config.BASE_URL}/customer`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Customer response:', data);

        const user = data?.data || data;

        //  المستخدم قديم إذا عنده اسم مسجل
        const hasName = user?.name && String(user.name).trim() !== '';

        if (hasName) {
          //  مستخدم قديم → نتجاوز ProfileInfoPage
          localStorage.setItem('userName', user.name);
          if (user.email) localStorage.setItem('userEmail', user.email);
          if (user.image) localStorage.setItem('userImage', user.image);
          if (user.phone) localStorage.setItem('phone', user.phone);

          if (redirect) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirect);
          } else {
            navigate('/ProfilePage');
          }
        } else {
          //  مستخدم جديد → ProfileInfoPage
          navigate('/ProfileInfoPage');
        }
      })
      .catch((err) => {
        console.error('Customer fetch error:', err);
        //  إذا فشل الفحص، نفترض أنه مستخدم جديد
        navigate('/ProfileInfoPage');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const code = otp.join('');
    if (code.length < 5) {
      setError('Please enter the 5-digit verification code');
      return;
    }

    setLoading(true);

    fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.VERIFY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ phone, otp: code }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => {
            throw new Error(e.message || "Invalid code");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Verify Success:', data);

        const token = data?.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          window.dispatchEvent(new Event('customer-auth-changed'));
        }

        //  نتحقق من المستخدم
        checkUserAndRedirect(token || localStorage.getItem('token'));
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout>
      <h3 className="form-title">Verification</h3>
      <p className="form-subtitle">
        Enter the code we send to :<span className="text-dark fw-medium"> {phone}</span>
      </p>

      {error && <div className="text-danger mt-2 small alert alert-warning">{error}</div>}
      {success && <div className="text-success mt-2 small alert alert-success">{success}</div>}

      <Form onSubmit={handleSubmit}>
        <div className="verification-inputs">
          {otp.map((digit, index) => (
            <Form.Control
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input m-2 text-center"
              placeholder="•"
              disabled={loading}
            />
          ))}
        </div>

        <div className="resend-container">
          <span>Didn't receive code ? </span>
          <span className={`fw-medium ${timer > 0 ? 'text-danger' : 'text-muted'}`}>
            00:{timer < 10 ? `0${timer}` : timer}
          </span>
          <div className="mt-1">
            <span
              className={`resend-link ${timer > 0 || resendLoading ? 'disabled-link' : ''}`}
              onClick={handleResendCode}
              style={{
                cursor: timer > 0 || resendLoading ? 'not-allowed' : 'pointer',
                opacity: timer > 0 || resendLoading ? 0.5 : 1,
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary-custom mb-3 text-decoration-none text-white text-center d-block w-100"
        >
          {loading ? "Submitting..." : "Verify"}
        </button>

        <div className="divider-container">or</div>

        <Button
          className="btn-outline-custom"
          type="button"
          disabled={loading}
          onClick={() => window.history.back()}
        >
          Go back
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Verification;