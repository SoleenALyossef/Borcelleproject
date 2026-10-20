import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const ToastAlert = ({ show, onClose, type = 'info', message }) => {
  const icons = {
    success: <FaCheckCircle size={38} color="var(--success)" />,
    error: <FaExclamationCircle size={38} color="var(--danger)" />,
    info: <FaInfoCircle size={38} color="var(--primary)" />,
  };

  const titles = {
    success: 'Success',
    error: 'Oops!',
    info: 'Notice',
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      contentClassName="custom-alert-modal"
    >
      <Modal.Body className="text-center py-4 px-4">
        <div className="mb-3 d-flex justify-content-center">
          {icons[type]}
        </div>

        <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
          {titles[type]}
        </h5>

        <p className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {message}
        </p>

        <Button
          className="px-4 py-2 border-0 fw-semibold"
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            borderRadius: '8px',
            minWidth: '120px',
          }}
          onClick={onClose}
        >
          OK
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ToastAlert;