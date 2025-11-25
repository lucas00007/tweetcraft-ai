import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
}) : null;

export async function POST(req) {
  console.log('Stripe Secret Key exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('NEXT_PUBLIC_URL:', process.env.NEXT_PUBLIC_URL);
  
  if (!stripe) {
    console.error('Stripe not configured!');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  
  try {
    const { priceId } = await req.json();
    console.log('Price ID received:', priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      allow_promotion_codes: true,
    });

    console.log('Checkout session created:', session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
    
  } catch (error) {
    console.error('Stripe error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}