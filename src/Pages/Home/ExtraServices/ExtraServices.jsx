
import { Row, Col, Card } from 'react-bootstrap';
import { FiSearch, FiArchive, FiSend, FiShield } from 'react-icons/fi';
import './HomeSections.css';   

const defaultServices = [
  { id: 1, title: 'Source from Industry Hubs', image: '../src/assets/image/image 108.png', icon: <FiSearch size={18} /> },
  { id: 2, title: 'Customize Your Products', image: '../src/assets/image/image 104.png', icon: <FiArchive size={18} /> },
  { id: 3, title: 'Fast, reliable shipping by ocean or air', image: '../src/assets/image/image 107.png', icon: <FiSend size={18} /> },
  { id: 4, title: 'Product monitoring and inspection', image: '../src/assets/image/image 106.png', icon: <FiShield size={18} /> }
];

const ExtraServices = ({ title = 'Our extra services', services = defaultServices }) => {
  return (
    <section className="py-4">
      <h5 className="fw-bold text-dark mb-3 fs-5" style={{ color: 'var(--text-main)' }}>{title}</h5>

      <Row className="g-3">
        {services.map((service) => (
          <Col lg={3} md={6} sm={6} xs={12} key={service.id}>
            <Card
              className="h-100 border-0 rounded-3 overflow-hidden shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className="position-relative" style={{ height: '120px', backgroundColor: '#1a1e22' }}>
                <Card.Img
                  src={service.image}
                  alt={service.title}
                  style={{ height: '100%', width: '100%', objectFit: 'cover', opacity: 0.85 }}
                />
                <div
                  className="position-absolute end-0 bottom-0 translate-middle-y me-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: '2px solid var(--bg-card)',
                    transform: 'translateY(50%)',
                    zIndex: 2
                  }}
                >
                  {service.icon}
                </div>
              </div>

              <Card.Body className="pt-4 pb-3 px-3" style={{ backgroundColor: 'var(--bg-card)' }}>
                <Card.Text
                  className="fw-medium mb-0 pe-4"
                  style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.4' }}
                >
                  {service.title}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default ExtraServices;