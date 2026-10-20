import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { API_Config } from '../Config/API-Config';

const clearCustomerSession = () => {
  ['token', 'userName', 'userEmail', 'phone', 'userImage'].forEach((key) => localStorage.removeItem(key));
};

/** Validates the customer token with the server before rendering private account data. */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [status, setStatus] = useState(() => (token ? 'checking' : 'anonymous'));

  useEffect(() => {
    const activeToken = localStorage.getItem('token');
    if (!activeToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('anonymous');
      return undefined;
    }

    const controller = new AbortController();
    setStatus('checking');

    fetch(`${API_Config.BASE_URL}/customer`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${activeToken}`,
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          const error = new Error('Customer session could not be verified');
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then(() => {
        if (!controller.signal.aborted) setStatus('authenticated');
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error.status === 401 || error.status === 403) {
          clearCustomerSession();
          setStatus('anonymous');
        } else {
          // Fail closed: do not display private data when the API is unreachable.
          // Keep the token on transient server/network errors so a valid session is not destroyed.
          setStatus('unverified');
        }
      });

    return () => controller.abort();
  }, [location.pathname, token]);

  if (!token || status === 'anonymous' || status === 'unverified') {
    const attemptedPath = `${location.pathname}${location.search || ''}${location.hash || ''}`;
    return <Navigate to="/" replace state={{ authRequired: true, attemptedPath }} />;
  }

  if (status !== 'authenticated') {
    return (
      <div className="account-route-loading" role="status" aria-live="polite">
        <span className="account-route-spinner" />
        <span>Checking your session…</span>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
