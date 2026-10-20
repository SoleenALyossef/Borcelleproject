import React from 'react';
import { Container } from 'react-bootstrap';
import Navbarpayment from '../PaymentMethod/Navbarpayment';;
import PageBanner from './PageBanner';
import './SharedPages.css';

const TermsPage = () => {
 
  const termsData = [
    { title: "Acceptance of Terms", text: "By using this application, you acknowledge that you have read, understood, and agree to fully comply with these terms. If you do not agree with these terms, please do not use the application. The application management reserves the right to modify these terms at any time, and you will be notified of updates when necessary." },
    { title: "Account Creation and Use", text: "By using this application, you acknowledge that you have read, understood, and agree to fully comply with these terms. If you do not agree with these terms, please do not use the application. The application management reserves the right to modify these terms at any time, and you will be notified of updates when necessary." },
    { title: "Acceptance of Terms", text: "By using this application, you acknowledge that you have read, understood, and agree to fully comply with these terms. If you do not agree with these terms, please do not use the application. The application management reserves the right to modify these terms at any time, and you will be notified of updates when necessary." },
    { title: "Intellectual Property Rights", text: "By using this application, you acknowledge that you have read, understood, and agree to fully comply with these terms. If you do not agree with these terms, please do not use the application. The application management reserves the right to modify these terms at any time, and you will be notified of updates when necessary." },
  ];

  return (
    <>
    <Navbarpayment/>
      <Container>
        <div className="page-white-container">
          <PageBanner title="Terms and condition" showBack={true}  />
          
          <div className="terms-content">
            {termsData.map((term, index) => (
              <div key={index} className="term-section">
                <h4 className="term-title">{term.title}</h4>
                <p className="term-text">{term.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default TermsPage;