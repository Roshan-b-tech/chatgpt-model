import React, { useState } from "react";

export default function DictionaryPage() {
    const [word, setWord] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDefinition = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            if (!res.ok) throw new Error("Word not found");
            const data = await res.json();
            setResult(data[0]);
        } catch (err: any) {
            setError(err.message || "Error fetching definition");
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
            <h1 style={{ fontSize: 32, marginBottom: 16, textAlign: "center" }}>📖 Dictionary</h1>
            <form
                onSubmit={fetchDefinition}
                style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 32,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: 500,
                }}
            >
                <input
                    type="text"
                    value={word}
                    onChange={e => setWord(e.target.value)}
                    placeholder="Enter a word (e.g. example)"
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
            {result && (
                <div
                    style={{
                        background: "#232323",
                        borderRadius: 16,
                        padding: 24,
                        width: "100%",
                        maxWidth: 500,
                        marginBottom: 32,
                        boxShadow: "0 2px 12px #0002",
                        wordBreak: "break-word",
                    }}
                >
                    <h2 style={{ fontSize: 24, marginBottom: 8 }}>{result.word}</h2>
                    {result.phonetics && result.phonetics[0] && result.phonetics[0].text && (
                        <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.8 }}>
                            <span>/{result.phonetics[0].text}/</span>
                            {result.phonetics[0].audio && (
                                <audio controls src={result.phonetics[0].audio} style={{ marginLeft: 8, verticalAlign: "middle" }}>
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    )}
                    {result.meanings && result.meanings.map((meaning: any, idx: number) => (
                        <div key={idx} style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>{meaning.partOfSpeech}</div>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {meaning.definitions.map((def: any, i: number) => (
                                    <li key={i} style={{ fontSize: 16, marginBottom: 6 }}>
                                        {def.definition}
                                        {def.example && (
                                            <div style={{ fontSize: 14, opacity: 0.7, marginTop: 2 }}>Example: {def.example}</div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 