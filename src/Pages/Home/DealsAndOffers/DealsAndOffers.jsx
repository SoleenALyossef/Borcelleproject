import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { API_Config } from '../../../Config/API-Config';
import { useTranslation } from 'react-i18next'; 

const DealsAndOffers = ({ 
  title = "Deals and offers", 
  subtitle = "Hygiene equipments", 
  targetDate 
}) => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  useEffect(() => {
    setLoading(true);
    setError("");

    const url = `${API_Config.BASE_URL}/product`;

    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "حدث خطأ أثناء جلب العروض والمنتجات");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Deals products success:", data);
        
  
        const root = data?.data ?? data;
        const items = Array.isArray(root) ? root : (Array.isArray(root?.data) ? root.data : []);
        const apiProducts = items.slice(0, 5).map((item) => ({
          id: item.id,
          title: i18n.language === 'ar' ? (item.ar?.name || item.name || item.en?.name || item.title) : (item.en?.name || item.name || item.ar?.name || item.title),
          image: item.image || item.thumbnail,
          discount: item.discount ? `${item.discount}%` : "25%"
        }));

        setProducts(apiProducts);
      })
      .catch((err) => {
        console.error("Error fetching deals:", err);
        setError(err.message || "حدث خطأ أثناء الاتصال بالسيرفر");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [i18n.language]);


  const [endTime] = useState(() => {
    if (targetDate) return new Date(targetDate).getTime();
    const duration = (4 * 24 * 60 * 60) + (13 * 60 * 60) + (34 * 60);
    return Date.now() + (duration * 1000);
  });

  const calculateTimeLeft = () => {
    const difference = endTime - Date.now();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    
    <Card className="mb-4 shadow-sm border rounded overflow-hidden">
      <Card.Body className="p-0">
        <Row className="g-0">
          

          <Col lg={3} md={4} className="p-4 border-end d-flex flex-column justify-content-between"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{title}</h5>
              <p className="small mb-3" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
            </div>
            
       
            <div className="d-flex gap-2 text-center mt-2">
              <div className="bg-dark text-white rounded p-2 flex-fill">
                <div className="fw-bold fs-6">{formatTime(timeLeft.days)}</div>
                <small style={{ fontSize: '10px' }}>Days</small>
              </div>
              <div className="bg-dark text-white rounded p-2 flex-fill">
                <div className="fw-bold fs-6">{formatTime(timeLeft.hours)}</div>
                <small style={{ fontSize: '10px' }}>Hour</small>
              </div>
              <div className="bg-dark text-white rounded p-2 flex-fill">
                <div className="fw-bold fs-6">{formatTime(timeLeft.minutes)}</div>
                <small style={{ fontSize: '10px' }}>Minute</small>
              </div>
              <div className="bg-dark text-white rounded p-2 flex-fill">
                <div className="fw-bold fs-6">{formatTime(timeLeft.seconds)}</div>
                <small style={{ fontSize: '10px' }}>Sec</small>
              </div>
            </div>
          </Col>

        
          <Col lg={9} md={8}>
           <style>{`
          .custom-loader {
            width: 50px;
            aspect-ratio: 1;
            display: grid;
            -webkit-mask: conic-gradient(from 15deg, #0000, #000);
            animation: l26 1s infinite steps(12);
          }
          .custom-loader, .custom-loader:before, .custom-loader:after {
            background:
              radial-gradient(closest-side at 50% 12.5%, #f13b63 96%, #0000) 50% 0/20% 80% repeat-y,
              radial-gradient(closest-side at 12.5% 50%, #f13b63 96%, #0000) 0 50%/80% 20% repeat-x;
          }
          .custom-loader:before, .custom-loader:after {
            content: ""; grid-area: 1/1; transform: rotate(30deg);
          }
          .custom-loader:after { transform: rotate(60deg); }
          @keyframes l26 { 100% { transform: rotate(1turn); } }
        `}</style>
            {loading ? (
               <div className=" p-5 text-center my-4 d-flex flex-column align-items-center ">
                 <div className="custom-loader" /> 
                 <p className="mt-3 text-secondary fw-bold mb-0">Loading products...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-danger small">
                {error}
              </div>
            ) : (
              <Row className="row-cols-2 row-cols-sm-3 row-cols-lg-5 g-0 h-100">
                {products.map((product, index) => (
                  <Col
                    key={product.id}
                    className={`p-3 text-center d-flex flex-column align-items-center justify-content-between ${
                      index !== products.length - 1 ? 'border-end' : ''
                    }`}
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="w-100 d-flex justify-content-center align-items-center" style={{ height: '110px' }}>
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="img-fluid mh-100" 
                        style={{ objectFit: 'contain' }} 
                      />
                    </div>
                    <div className="mt-2 w-100">
                      <h6 className="small text-truncate mb-2" title={product.title} style={{ color: 'var(--text-main)' }}>
                        {product.title}
                      </h6>
                      <Badge bg="danger" className="bg-opacity-10 text-danger fw-semibold px-2 py-1 rounded-pill">
                        -{product.discount}
                      </Badge>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Col>

        </Row>
      </Card.Body>
    </Card>
  );
};

export default DealsAndOffers;