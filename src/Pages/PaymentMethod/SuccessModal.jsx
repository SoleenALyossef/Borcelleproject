import { Modal, Button } from 'react-bootstrap';

const SuccessModal = ({ show, onHide, onContinue }) => {
  return (
    <Modal show={show} onHide={onHide} centered className="success-modal">
      <Modal.Header closeButton className="border-0 pb-0" />
      <Modal.Body>
        <div className="">
          <img src='../src\assets\image\Group (2).png'/>
        </div>
        
        <h5 className="fw-normal " style={{ color: '#444' }}>
          you have successfully paid for your order
        </h5>

        <hr className=" text-muted opacity-25" />

        <Button className="btn-primary-custom w-100" onClick={onContinue}>
          Continue
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;