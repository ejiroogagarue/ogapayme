import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { amount, linkId, description } = await request.json();

        // Validate the input 
        if(!amount || !linkId || !description) {
            return NextResponse.json({ error: 'Missing required fields'}, { status: 400});
        }

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: description,
                        },
                        // The amount must be in the smallest currency unit (e.g., cents)
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            //These URLS are where Stripe will redirect the user after payment 
            success_url: `${request.headers.get('origin')}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/pay/${linkId}`,
            // This is the magic key that links the payment to your databse record
            client_reference_id: linkId,
        });

        return NextResponse.json({sessionId: session.id, url: session.url}, {status: 200});
    } catch(err){
        const error = err as Error;
        console.error(error.message);
        return NextResponse.json({ error: error.message}, {status: 500});
    }
}

