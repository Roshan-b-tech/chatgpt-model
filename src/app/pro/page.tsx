"use client";
export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";

const StripeCheckoutButton = nextDynamic(() => import("@/components/StripeCheckoutButton"), { ssr: false });

export default function ProPage() {
    return (
        <div
            style={{
                background: "#161616",
                color: "#e8e8e6",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
        >
            <div
                style={{
                    background: "#232323",
                    borderRadius: 20,
                    padding: "32px 20px",
                    maxWidth: 420,
                    width: "100%",
                    boxShadow: "0 2px 24px #0003",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div style={{ fontSize: 48, marginBottom: 8, textAlign: "center" }}>👑</div>
                <h1 style={{ fontSize: 28, marginBottom: 10, textAlign: "center", lineHeight: 1.1 }}>Pro Plan</h1>
                <p style={{ fontSize: 17, opacity: 0.85, textAlign: "center", marginBottom: 20, lineHeight: 1.4 }}>
                    Unlock all premium features,<br />priority support, and more!
                </p>
                <ul style={{
                    fontSize: 15,
                    opacity: 0.92,
                    marginBottom: 28,
                    paddingLeft: 18,
                    width: "100%",
                    maxWidth: 340,
                    textAlign: "left",
                    lineHeight: 1.5,
                }}>
                    <li><b>Unlimited</b> plugin usage</li>
                    <li>Priority access to <b>new features</b></li>
                    <li>Early access to <b>AI upgrades</b></li>
                    <li>And much more...</li>
                </ul>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <StripeCheckoutButton />
                </div>
                <div
                    style={{
                        fontSize: 13,
                        opacity: 0.7,
                        marginTop: 18,
                        textAlign: "center",
                        lineHeight: 1.4,
                        maxWidth: 320,
                        wordBreak: "break-word",
                    }}
                >
                    <span style={{ fontWeight: 500 }}>Test mode:</span> Use card <b>4242 4242 4242 4242</b><br />with any future expiry and CVC.
                </div>
            </div>
            <style>{`
        @media (max-width: 600px) {
          div[style*='maxWidth: 420px'] {
            padding: 20px 4px !important;
            max-width: 98vw !important;
          }
          h1 {
            font-size: 22px !important;
          }
          ul {
            font-size: 14px !important;
            padding-left: 12px !important;
          }
        }
      `}</style>
        </div>
    );
} 