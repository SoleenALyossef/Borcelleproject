import React, { useState } from 'react';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import { FiUser, FiMail } from 'react-icons/fi';
import { BiMessageDetail } from 'react-icons/bi';
import Navbarpayment from '../PaymentMethod/Navbarpayment';
import PageBanner from './PageBanner';
import './SharedPages.css';
import { API_Config } from '../../Config/API-Config'; 

const ContactPage = () => {

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: ""
  });


  const handleContactSubmit = (e) => {
    e.preventDefault();

  
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CONTACT}`;

    const payload = {
      type: "EMAIL",
      email: contactData.email,
      message: contactData.message,
      name: contactData.name 
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((ServerError) => {
            throw new Error(ServerError.message || "Something went wrong!");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Success:", data);
        alert("Your message has been sent successfully!");
        // تفريغ الحقول بعد نجاح الإرسال
        setContactData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to send message: " + err.message);
      });
  };

  return (
    <>
      <Navbarpayment />
      <Container>
        <div className="page-white-container">
          <PageBanner title="Contact us page" showBack={true} />


          <Form className="contact-form-container mt-4" onSubmit={handleContactSubmit}>
            
            {/* حقل الاسم */}
            <InputGroup className="mb-4">
              <Form.Control
                placeholder="Name..."
                className="custom-input-field border-end-0"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                required
              />
              <InputGroup.Text className="border-start-0" style={{ color: 'var(--primary)', backgroundColor: 'var(--bg-input)' }}>
                <FiUser size={20} />
              </InputGroup.Text>
            </InputGroup>

            {/* حقل الإيميل */}
            <InputGroup className="mb-4">
              <Form.Control
                placeholder="Email"
                type="email"
                className="custom-input-field border-end-0"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                required
              />
              <InputGroup.Text className="bg-white border-start-0" style={{ color: '#ed355a' }}>
                <FiMail size={20} />
              </InputGroup.Text>
            </InputGroup>

            {/* حقل الرسالة - Textarea */}
            <div className="textarea-wrapper mb-4">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write message"
                className="custom-textarea"
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                required
              />
              <BiMessageDetail size={22} className="textarea-icon" />
            </div>

            {/* زر الإرسال */}
            <Button className="btn-send mt-2" type="submit">
              Send
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default ContactPage;