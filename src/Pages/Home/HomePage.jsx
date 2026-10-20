import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bootstrap';
import MainNavbar from '../../components/MainNavbar';
import Footer from '../../components/Footer';
import ExtraServices from './ExtraServices/ExtraServices';
import SuppliersByRegion from './ExtraServices/SuppliersByRegion';
import { Container } from 'react-bootstrap';
import RecommendedItems from './RecommendedItems/RecommendedItems';
import InquiryBanner from './InquiryBanner/InquiryBanner';
import CategorySection from './CategorySection/CategorySection';
import DealsAndOffers from './DealsAndOffers/DealsAndOffers';
import image1 from '../../assets/image/image 98.png';
import image from '../../assets/image/image 92.png';
import HeroSection from './HeroSection/HeroSection';
import Subscribe from '../../components/Subscribe';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const authPrompt = Boolean(location.state?.authRequired);
  const attemptedPath = location.state?.attemptedPath || '';

  const closeAuthPrompt = () => navigate('/', { replace: true, state: null });

  const goToLogin = () => {
    const normalizedAttempt = attemptedPath.split(/[?#]/)[0].toLowerCase();
    if (attemptedPath && attemptedPath.startsWith('/') && !attemptedPath.startsWith('//') && normalizedAttempt !== '/profileinfopage') {
      localStorage.setItem('redirectAfterLogin', attemptedPath);
    }
    navigate('/LoginPage', {
      state: { requiresAuth: true, from: attemptedPath || undefined },
    });
  };

  return (
    <div>
      <MainNavbar />
      <Modal show={authPrompt} onHide={closeAuthPrompt} centered backdrop="static" aria-labelledby="login-required-title">
        <Modal.Header closeButton>
          <Modal.Title id="login-required-title">{isArabic ? 'يلزم تسجيل الدخول' : 'Login required'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isArabic
            ? 'تحتوي هذه الصفحة على معلومات شخصية. يرجى تسجيل الدخول للمتابعة.'
            : 'This page contains personal account information. Please sign in to continue.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeAuthPrompt}>{isArabic ? 'العودة للرئيسية' : 'Go to home'}</Button>
          <Button onClick={goToLogin} style={{ backgroundColor: '#f13b63', borderColor: '#f13b63' }}>
            {isArabic ? 'تسجيل الدخول / إنشاء حساب' : 'Sign in / Register'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Container className="py-4">
        <HeroSection />
        <DealsAndOffers />
        <CategorySection
          bannerTitle="Home and outdoor"
          bannerImage={image}
          categoryId={1}
        />
        <CategorySection
          bannerTitle="Consumer electronics and gadgets"
          bannerImage={image1}
          categoryId={2}
        />
        <InquiryBanner />
        <RecommendedItems />
        <ExtraServices />
        <SuppliersByRegion />
      </Container>
      <Subscribe onSubscribe={(email) => console.log('Subscribed:', email)} />
      <Footer />
    </div>
  );
};

export default HomePage;
