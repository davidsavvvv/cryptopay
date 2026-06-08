import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "eur", merchantUsername, linkId } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe travaille en centimes
      currency,
      metadata: {
        merchantUsername: merchantUsername ?? "",
        linkId: linkId ?? "",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
