import React, { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

export default function StocksPage() {
    const [symbol, setSymbol] = useState("");
    const [stock, setStock] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchStock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setStock(null);
        setHistory([]);
        try {
            // Fetch current price
            const res = await fetch(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
            );
            const data = await res.json();
            if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) throw new Error("Stock not found");
            setStock(data["Global Quote"]);
            // Fetch daily history for mini chart
            const res2 = await fetch(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
            );
            const data2 = await res2.json();
            const series = data2["Time Series (Daily)"] || {};
            const chartData = Object.entries(series).slice(0, 7).reverse().map(([date, val]: any) => ({
                date,
                close: parseFloat(val["4. close"]),
            }));
            setHistory(chartData);
        } catch (err: any) {
            setError(err.message || "Error fetching stock data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: "#161616",
            color: "#e8e8e6",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 60,
        }}>
            <h1 style={{ fontSize: 32, marginBottom: 16 }}>📈 Stocks</h1>
            <form onSubmit={fetchStock} style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                <input
                    type="text"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter stock symbol (e.g. AAPL)"
                    style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "none",
                        outline: "none",
                        fontSize: 18,
                        background: "#232323",
                        color: "#e8e8e6",
                        width: 220,
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        borderRadius: 8,
                        border: "none",
                        background: "#1fb8cd",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 18,
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </form>
            {loading && <div style={{ fontSize: 18, margin: 16 }}>Loading...</div>}
            {error && <div style={{ color: "#ff4b4b", margin: 16 }}>{error}</div>}
            {stock && (
                <div style={{
                    background: "#232323",
                    borderRadius: 16,
                    padding: 24,
                    minWidth: 320,
                    marginBottom: 32,
                    boxShadow: "0 2px 12px #0002",
                }}>
                    <h2 style={{ fontSize: 24, marginBottom: 8 }}>{symbol}</h2>
                    <div style={{ fontSize: 36, fontWeight: 700 }}>${parseFloat(stock["05. price"]).toFixed(2)}</div>
                    <div style={{ fontSize: 18, color: parseFloat(stock["09. change"] || 0) >= 0 ? "#61d345" : "#ff4b4b" }}>
                        {parseFloat(stock["09. change"] || 0) >= 0 ? "+" : ""}{parseFloat(stock["09. change"] || 0).toFixed(2)} ({parseFloat(stock["10. change percent"] || 0).toFixed(2)}%)
                    </div>
                    <div style={{ marginTop: 12, fontSize: 16, opacity: 0.8 }}>
                        Last trading day: {stock["07. latest trading day"]}
                    </div>
                    {history.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                            <svg width="240" height="80">
                                <polyline
                                    fill="none"
                                    stroke="#1fb8cd"
                                    strokeWidth="3"
                                    points={history.map((d, i) => `${(i / (history.length - 1)) * 220 + 10},${70 - ((d.close - Math.min(...history.map(h => h.close))) / (Math.max(...history.map(h => h.close)) - Math.min(...history.map(h => h.close)) + 0.01)) * 60}`).join(" ")}
                                />
                                {history.map((d, i) => (
                                    <circle key={i} cx={(i / (history.length - 1)) * 220 + 10} cy={70 - ((d.close - Math.min(...history.map(h => h.close))) / (Math.max(...history.map(h => h.close)) - Math.min(...history.map(h => h.close)) + 0.01)) * 60} r="3" fill="#fff" />
                                ))}
                            </svg>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa", marginTop: 4 }}>
                                <span>{history[0].date}</span>
                                <span>{history[history.length - 1].date}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 