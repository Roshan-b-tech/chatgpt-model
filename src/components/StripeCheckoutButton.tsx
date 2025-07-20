"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckoutButton() {
    const handleClick = async () => {
        const res = await fetch("/api/create-checkout-session", { method: "POST" });
        const data = await res.json();
        if (!data.id) {
            alert(data.error || "Failed to create Stripe session");
            return;
        }
        const stripe = await stripePromise;
        if (stripe) {
            await stripe.redirectToCheckout({ sessionId: data.id });
        }
    };

    return (
        <button
            onClick={handleClick}
            style={{
                background: "#1fb8cd",
                color: "#fff",
                padding: "12px 32px",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
            }}
        >
            Buy Pro Plan ($10)
        </button>
    );
} 