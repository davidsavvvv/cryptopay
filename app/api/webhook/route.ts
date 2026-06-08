import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const { merchantUsername, linkId } = intent.metadata;
    const amountEur = intent.amount / 100;
    const amountUsdt = amountEur * 0.99;

    console.log(`✅ Paiement reçu : ${amountEur}€ pour ${merchantUsername}`);
    console.log(`💸 À envoyer : ${amountUsdt} USDT`);

    // TODO: envoyer USDT via ethers.js
  }

  return NextResponse.json({ received: true });
}
