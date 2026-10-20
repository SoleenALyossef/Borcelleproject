
import { Row, Col } from 'react-bootstrap';
import './HomeSections.css';

const defaultSuppliers = [
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae' },
  { id: 2, country: 'Australia', domain: 'shopname.ae', flagCode: 'au' },
  { id: 3, country: 'United States', domain: 'shopname.ae', flagCode: 'us' },
  { id: 4, country: 'Russia', domain: 'shopname.ru', flagCode: 'ru' },
  { id: 5, country: 'Italy', domain: 'shopname.it', flagCode: 'it' },
  { id: 6, country: 'Denmark', domain: 'denmark.com.dk', flagCode: 'dk' },
  { id: 7, country: 'France', domain: 'shopname.com.fr', flagCode: 'fr' },
  { id: 8, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae' },
  { id: 9, country: 'China', domain: 'shopname.ae', flagCode: 'cn' },
  { id: 10, country: 'Great Britain', domain: 'shopname.co.uk', flagCode: 'gb' }
];

const SuppliersByRegion = ({ title = 'Suppliers by region', suppliers = defaultSuppliers }) => {
  return (
    <section className="suppliers-section my-4">
      <h5 className="section-title">{title}</h5>
      <Row className="d-flex flex-wrap gap-3 justify-content-center">
        {suppliers.map((item) => (
          <Col lg={2} md={3} key={item.id}>
            <div className="supplier-item">
              <img
                src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                alt={item.country}
                className="supplier-flag"
              />
              <div className="supplier-info">
                <span className="supplier-name">{item.country}</span>
                <span className="supplier-domain">{item.domain}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default SuppliersByRegion;