"use client";
export const dynamic = "force-dynamic";

import React from "react";

export default function WeatherPage() {
    return (
        <div style={{
            background: "#161616",
            color: "#e8e8e6",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>🌦️ Weather</h1>
            <p style={{ fontSize: 18, opacity: 0.8 }}>Get the latest weather forecast. (Feature coming soon!)</p>
        </div>
    );
} 