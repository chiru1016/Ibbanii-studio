import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const isSuccess = status === 'success';

  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '50px' }}>
        {isSuccess ? (
          <>
            <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '20px' }} />
            <h1 style={{ marginBottom: '10px' }}>Payment Successful!</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Your order has been placed successfully. Thank you for shopping with us!</p>
            <Link to="/profile" className="btn-primary">View My Orders</Link>
          </>
        ) : (
          <>
            <XCircle size={80} color="var(--error)" style={{ marginBottom: '20px' }} />
            <h1 style={{ marginBottom: '10px' }}>Payment Failed</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Something went wrong with your payment. Please try again or contact support.</p>
            <Link to="/checkout" className="btn-primary">Try Again</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
