"use client";

import React from "react";

export default function DictionaryPage() {
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
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>📖 Dictionary</h1>
            <p style={{ fontSize: 18, opacity: 0.8 }}>Look up word definitions. (Feature coming soon!)</p>
        </div>
    );
} 