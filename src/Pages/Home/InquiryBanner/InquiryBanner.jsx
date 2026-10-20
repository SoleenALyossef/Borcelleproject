import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { API_Config } from '../../../Config/API-Config';

const InquiryBanner = ({
  title = "An easy way to send requests to all suppliers",
  description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.",
  bgImage = "src/assets/image/image 102.png",
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    email: '',
    item: '',
    details: '',
    quantity: '',
    unit: 'Pcs'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (success) setSuccess('');
    if (error) setError('');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      item: '',
      details: '',
      quantity: '',
      unit: 'Pcs'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CONTACT}`;

    const messageParts = [];
    if (formData.item) messageParts.push(`Item: ${formData.item}`);
    if (formData.quantity) messageParts.push(`Quantity: ${formData.quantity} ${formData.unit}`);
    if (formData.details) messageParts.push(`Details: ${formData.details}`);
    const message = messageParts.join('\n');

    const payload = {
      temp_user_id: 'nullable',
      type: 'EMAIL',
      email: formData.email,
      message: message,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(
              serverError.message || `HTTP ${res.status}: Failed to send inquiry`
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Contact response:', data);
        setSuccess('Your inquiry has been sent successfully!');
        resetForm();
        if (onSubmit) onSubmit(payload);
      })
      .catch((err) => {
        console.error('Contact error:', err);
        setError(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="rounded-3 overflow-hidden text-white my-4 p-4 p-md-5"
      style={{
        background: `linear-gradient(105deg, rgba(241, 59, 99, 0.85) 0%, rgba(241, 59, 99, 0.65) 100%), url('${bgImage}') center/cover no-repeat`
      }}
    >
      <Row className="align-items-center gy-4">

        <Col lg={7} md={6}>
          <h2 className="fw-bold mb-3 fs-2" style={{ maxWidth: '440px', lineHeight: '1.25' }}>
            {title}
          </h2>
          <p className="opacity-75 mb-0" style={{ maxWidth: '420px', fontSize: '0.92rem', lineHeight: '1.5' }}>
            {description}
          </p>
        </Col>

        <Col lg={5} md={6}>
          <Card className="border-0 shadow-sm rounded-3 p-3 p-md-4 text-dark bg-white">
            <Card.Body className="p-0">
              <h5 className="fw-bold mb-3 text-dark fs-6">
                Send quote to suppliers
              </h5>

              {/* ✅ Success message - تصميم متناسق مع اللون الأساسي */}
              {success && (
                <div
                  className="d-flex align-items-center gap-2 rounded-2 px-3 py-2 mb-3"
                  style={{
                    backgroundColor: 'rgba(241, 59, 99, 0.08)',
                    border: '1px solid rgba(241, 59, 99, 0.25)',
                    color: '#f13b63',
                    fontSize: '0.85rem',
                  }}
                >
                  <FaCheckCircle size={16} />
                  <span className="fw-medium">{success}</span>
                </div>
              )}

              {/* ✅ Error message */}
              {error && (
                <div
                  className="d-flex align-items-center gap-2 rounded-2 px-3 py-2 mb-3"
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.08)',
                    border: '1px solid rgba(220, 53, 69, 0.25)',
                    color: '#dc3545',
                    fontSize: '0.85rem',
                  }}
                >
                  <FaExclamationCircle size={16} />
                  <span className="fw-medium">{error}</span>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow-none py-2 border-light-subtle rounded-2"
                    style={{ fontSize: '0.9rem' }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="item"
                    placeholder="What item you need?"
                    value={formData.item}
                    onChange={handleChange}
                    className="shadow-none py-2 border-light-subtle rounded-2"
                    style={{ fontSize: '0.9rem' }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="details"
                    placeholder="Type more details"
                    value={formData.details}
                    onChange={handleChange}
                    className="shadow-none py-2 border-light-subtle rounded-2"
                    style={{ fontSize: '0.9rem', resize: 'none' }}
                  />
                </Form.Group>

                <Row className="mb-3 g-2">
                  <Col xs={7}>
                    <Form.Control
                      type="text"
                      name="quantity"
                      placeholder="Quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="shadow-none py-2 border-light-subtle rounded-2"
                      style={{ fontSize: '0.9rem' }}
                    />
                  </Col>
                  <Col xs={5}>
                    <Form.Select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="shadow-none py-2 border-light-subtle rounded-2"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <option value="Pcs">Pcs</option>
                      <option value="Kg">Kg</option>
                      <option value="Liters">Liters</option>
                      <option value="Boxes">Boxes</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  disabled={loading}
                  className="border-0 fw-medium px-4 py-2 rounded-2 text-white d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#f13b63', fontSize: '0.9rem' }}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Sending...
                    </>
                  ) : (
                    'Send inquiry'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default InquiryBanner;