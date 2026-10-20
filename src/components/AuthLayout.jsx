import { Container, Row, Col } from 'react-bootstrap';
import '../components/AuthLayout.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import image from '../assets/image/Simplification.png';


const AuthLayout = ({ children }) => {
  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col  md={6} className="auth-left-pane p-0 d-flex flex-column justify-content-center align-items-center text-center text-white ">
          <div className="brand-logo d-flex  flex-column  align-items-center animate__backInDown animate__animated animate__slower	3s">
            <img src={image} size={50} color="white" className="mb-2" />
             <h2 className="welcome-title">Let's get started</h2>
          
            <h2 className="welcome-subtitle">
              Where opportunities meet simplicity!<br />
              Whether you're here to fill out your cart<br />
              or to check irresistible offers.
            </h2>
          </div>
          
         
        </Col>
        <Col  md={6} className="auth-right-pane p-0  d-flex justify-content-center align-items-center">
          <div className="auth-form-container">
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthLayout;