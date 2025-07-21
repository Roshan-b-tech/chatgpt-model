import React, { useState } from "react";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || process.env.OPENWEATHERMAP_API_KEY;

export default function WeatherPage() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchWeather = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setWeather(null);
        setForecast([]);
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
            );
            if (!res.ok) throw new Error("City not found");
            const data = await res.json();
            setWeather(data);
            // Fetch 3-day forecast
            const res2 = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
            );
            const data2 = await res2.json();
            // Get one forecast per day (at noon)
            const daily = data2.list.filter((item: any) => item.dt_txt.includes("12:00:00")).slice(0, 3);
            setForecast(daily);
        } catch (err: any) {
            setError(err.message || "Error fetching weather");
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
            paddingTop: 40,
            paddingLeft: 8,
            paddingRight: 8,
        }}>
            <h1 style={{ fontSize: 32, marginBottom: 16, textAlign: "center" }}>🌦️ Weather</h1>
            <form onSubmit={fetchWeather} style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 500 }}>
                <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Enter city name"
                    style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "none",
                        outline: "none",
                        fontSize: 18,
                        background: "#232323",
                        color: "#e8e8e6",
                        width: "100%",
                        minWidth: 0,
                        flex: 1,
                        marginBottom: 8,
                        maxWidth: 300,
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
                        minWidth: 100,
                        marginBottom: 8,
                    }}
                >
                    Search
                </button>
            </form>
            {loading && <div style={{ fontSize: 18, margin: 16 }}>Loading...</div>}
            {error && <div style={{ color: "#ff4b4b", margin: 16 }}>{error}</div>}
            {weather && (
                <div style={{
                    background: "#232323",
                    borderRadius: 16,
                    padding: 24,
                    width: "100%",
                    maxWidth: 500,
                    marginBottom: 32,
                    boxShadow: "0 2px 12px #0002",
                    wordBreak: "break-word",
                }}>
                    <h2 style={{ fontSize: 24, marginBottom: 8 }}>{weather.name}, {weather.sys.country}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Image src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" width={64} height={64} unoptimized />
                        <div>
                            <div style={{ fontSize: 36, fontWeight: 700 }}>{Math.round(weather.main.temp)}°C</div>
                            <div style={{ fontSize: 18 }}>{weather.weather[0].description}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12, fontSize: 16, opacity: 0.8 }}>
                        Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
                    </div>
                </div>
            )}
            {forecast.length > 0 && (
                <div style={{
                    background: "#232323",
                    borderRadius: 16,
                    padding: 20,
                    width: "100%",
                    maxWidth: 500,
                    boxShadow: "0 2px 12px #0002",
                    wordBreak: "break-word",
                }}>
                    <h3 style={{ fontSize: 20, marginBottom: 12 }}>3-Day Forecast</h3>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                        {forecast.map((item, idx) => (
                            <div key={idx} style={{ textAlign: "center", minWidth: 90, flex: 1 }}>
                                <div style={{ fontSize: 16, marginBottom: 4 }}>{new Date(item.dt_txt).toLocaleDateString()}</div>
                                <Image src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="icon" width={48} height={48} unoptimized />
                                <div style={{ fontSize: 18, fontWeight: 600 }}>{Math.round(item.main.temp)}°C</div>
                                <div style={{ fontSize: 14 }}>{item.weather[0].description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 