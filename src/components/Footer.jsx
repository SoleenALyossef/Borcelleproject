import { Container, Row, Col } from 'react-bootstrap';
import { FiChevronUp } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaApple, FaGooglePlay } from 'react-icons/fa';
import { BsBag } from 'react-icons/bs';

const defaultFooterSections = [
  {
    title: "About",
    links: [
      { label: "About Us", url: "#" },
      { label: "Find store", url: "#" },
      { label: "Categories", url: "#" },
      { label: "Blogs", url: "#" }
    ]
  },
  {
    title: "Partnership",
    links: [
      { label: "About Us", url: "#" },
      { label: "Find store", url: "#" },
      { label: "Categories", url: "#" },
      { label: "Blogs", url: "#" }
    ]
  },
  {
    title: "Information",
    links: [
      { label: "Help Center", url: "#" },
      { label: "Money Refund", url: "#" },
      { label: "Shipping", url: "#" },
      { label: "Contact us", url: "#" }
    ]
  },
  {
    title: "For users",
    links: [
      { label: "Login", url: "#/login" },
      { label: "Register", url: "#/register" },
      { label: "Settings", url: "#/profile" },
      { label: "My Orders", url: "#/orders" }
    ]
  }
];

const socialIcons = [
  { icon: <FaFacebookF />, url: "#facebook" },
  { icon: <FaTwitter />, url: "#twitter" },
  { icon: <FaLinkedinIn />, url: "#linkedin" },
  { icon: <FaInstagram />, url: "#instagram" },
  { icon: <FaYoutube />, url: "#youtube" }
];

const Footer = ({ 
  sections = defaultFooterSections, 
  companyDescription = "Best information about the company goes here but now lorem ipsum is",
  copyrightText = "© 2023 Ecommerce."
}) => {
  return (
    <footer className="bg-white">
      {/* القسم الرئيسي للفوتر */}
      <div className="py-5 border-bottom border-light-subtle">
        <Container>
          <Row className="gy-4">
            
       
            <Col lg={3} md={12}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <BsBag size={28} color="#f13b63" />
                <div className="lh-1">
                  <span className="fw-bold d-block text-dark fs-5">Borcelle</span>
                  <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                    Online Store
                  </small>
                </div>
              </div>
              <p className="text-secondary mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.5', maxWidth: '250px' }}>
                {companyDescription}
              </p>
              <div className="d-flex gap-2">
                {socialIcons.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url}
                    className="rounded-circle d-flex align-items-center justify-content-center text-white text-decoration-none"
                    style={{ width: '32px', height: '32px', backgroundColor: '#bbbfca', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f13b63';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#bbbfca';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </Col>

           
            <Col lg={7} md={9}>
              <Row className="gy-4">
                {sections.map((section, index) => (
                  <Col xs={6} md={3} key={index}>
                    <h6 className="fw-bold text-dark mb-3">{section.title}</h6>
                    <ul className="list-unstyled p-0 m-0">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex} className="mb-2">
                          <a 
                            href={link.url} 
                            className="text-decoration-none text-secondary"
                            style={{ fontSize: '0.9rem', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.target.style.color = '#f13b63'}
                            onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Col>
                ))}
              </Row>
            </Col>

      
            <Col lg={2} md={3}>
              <h6 className="fw-bold text-dark mb-3">Get app</h6>
              
              <a 
                href="#appstore" 
                className="d-flex align-items-center gap-2 bg-dark text-white rounded-3 px-2 py-1 mb-2 text-decoration-none"
                style={{ width: '130px', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <FaApple size={24} />
                <div className="d-flex flex-column lh-1 pt-1">
                  <small style={{ fontSize: '0.55rem', color: '#d1d1d1' }}>Download on the</small>
                  <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>App Store</span>
                </div>
              </a>
              
              <a 
                href="#googleplay" 
                className="d-flex align-items-center gap-2 bg-dark text-white rounded-3 px-2 py-1 text-decoration-none"
                style={{ width: '130px', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <FaGooglePlay size={20} />
                <div className="d-flex flex-column lh-1 pt-1">
                  <small style={{ fontSize: '0.55rem', color: '#d1d1d1' }}>GET IT ON</small>
                  <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>Google Play</span>
                </div>
              </a>
            </Col>

          </Row>
        </Container>
      </div>


      <div style={{ backgroundColor: '#eff2f4' }}>
        <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3 text-secondary" style={{ fontSize: '0.9rem' }}>
          <div className="mb-2 mb-md-0">{copyrightText}</div>
          <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
            <span className="fs-5">🇺🇸</span>
            <span>English</span>
            <FiChevronUp size={18} />
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;