import { useState } from 'react';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import { FiMail } from 'react-icons/fi';
import "../index.css";

const Subscribe = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (onSubscribe) {
      onSubscribe(email);
    } else {
      alert(`Subscribed with: ${email}`);
    }
    setEmail('');
  };

  return (
  <div className="py-5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <Container className="text-center">
        <h4 className="fw-bold mb-1 fs-5" style={{ color: 'var(--text-main)' }}>
          Subscribe on our newsletter
        </h4>
        <p className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Get daily news on upcoming offers from many suppliers all over the world
        </p>

        <Form onSubmit={handleSubscribeSubmit} className="mx-auto" style={{ maxWidth: '420px' }}>
          <InputGroup>
            <InputGroup.Text
              className="border-end-0"
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-muted)',
                borderColor: 'var(--border-color)'
              }}
            >
              <FiMail size={18} />
            </InputGroup.Text>

            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-start-0 shadow-none py-2"
              style={{
                fontSize: '0.95rem',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                borderColor: 'var(--border-color)'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
            />

            <Button
              type="submit"
              className="border-0 fw-medium px-4"
              style={{ backgroundColor: 'var(--primary)', fontSize: '0.95rem', color: '#fff' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary)')}
            >
              Subscribe
            </Button>
          </InputGroup>
        </Form>
      </Container>
    </div>
  );
};

export default Subscribe;