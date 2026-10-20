import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { API_Config } from '../../Config/API-Config';

const AddressModal = ({ show, onHide, onSaved }) => {
  const [form, setForm] = useState({
    name: '',
    phone: localStorage.getItem('phone') || '',
    city: '',
    neighborhood: '',
    street: '',
    building: '',
    zip_code: '',
    is_default: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = `${API_Config.BASE_URL}/address`;
    const payload = { ...form, lat: '3.12312', lng: '4.12312' };

    fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Failed to save address');
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Address save response:', data);

        const id =
          data?.data?.id ||
          data?.id ||
          data?.data?.data?.id ||
          (Array.isArray(data?.data) ? data.data[0]?.id : null);

        if (!id) {
          console.warn('Could not extract address id:', data);
          setError('Address saved but ID missing. Try again.');
          return;
        }

        if (onSaved) onSaved(id);
        onHide();
      })
      .catch((err) => {
        console.error('Address save error:', err);
        setError(err.message || 'Something went wrong');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" contentClassName="custom-alert-modal">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold fs-6" style={{ color: 'var(--text-main)' }}>
          Add Delivery Address
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={12}>
              <Form.Label className="small">Address Name</Form.Label>
              <Form.Control required value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Home / Work" />
            </Col>
            <Col md={12}>
              <Form.Label className="small">Phone</Form.Label>
              <Form.Control required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="09xxxxxxxx" />
            </Col>
            <Col md={6}>
              <Form.Label className="small">City</Form.Label>
              <Form.Control required value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
            </Col>
            <Col md={6}>
              <Form.Label className="small">Neighborhood</Form.Label>
              <Form.Control required value={form.neighborhood} onChange={(e) => handleChange('neighborhood', e.target.value)} />
            </Col>
            <Col md={8}>
              <Form.Label className="small">Street</Form.Label>
              <Form.Control required value={form.street} onChange={(e) => handleChange('street', e.target.value)} />
            </Col>
            <Col md={4}>
              <Form.Label className="small">Building</Form.Label>
              <Form.Control required value={form.building} onChange={(e) => handleChange('building', e.target.value)} />
            </Col>
            <Col md={6}>
              <Form.Label className="small">Zip Code</Form.Label>
              <Form.Control value={form.zip_code} onChange={(e) => handleChange('zip_code', e.target.value)} />
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-4">
            <Button type="button" variant="light" className="flex-fill py-2" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-fill py-2 border-0 fw-semibold" style={{ backgroundColor: 'var(--primary)', color: '#fff' }} disabled={loading}>
              {loading ? (<><Spinner as="span" animation="border" size="sm" className="me-2" />Saving...</>) : ('Save Address')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddressModal;