import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const body = await request.text();
  const event = JSON.parse(body);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.event_type === 'transaction.completed') {
    const userId = event.data.custom_data?.user_id;
    if (userId) {
      await supabase.from('subscriptions').insert({
        user_id: userId,
        paddle_order_id: event.data.id,
        paddle_transaction_id: event.data.transaction_id,
        status: 'active',
      });
      await supabase.from('profiles').update({ is_paid: true }).eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
