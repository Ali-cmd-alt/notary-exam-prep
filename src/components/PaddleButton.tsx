'use client';

import { useState } from 'react';
import { getPaddle } from '@/lib/paddle';
import { createClient } from '@/lib/supabase/client';

export default function PaddleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in first.');
        setLoading(false);
        return;
      }

      const paddle = await getPaddle();
      paddle.Checkout.open({
        items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!, quantity: 1 }],
        customer: { email: user.email },
        customData: { user_id: user.id },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
        },
      });
    } catch (e: any) {
      setError(e.message || 'Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePurchase} disabled={loading} className="btn-primary w-full text-lg py-4">
        {loading ? 'Opening checkout...' : 'Get Full Access — $14.99'}
      </button>
      {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
      <p className="text-xs text-gray-400 mt-3 text-center">
        One-time payment. No subscription. Secure checkout powered by Paddle.
      </p>
    </div>
  );
}
