import React from "react";

export const metadata = {
    title: "Your Clients",
};

export default function ClientsPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
                padding: "2rem",
                width: "100%",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "1.5rem",
                    boxShadow: "0 8px 32px rgba(30,41,59,0.08)",
                    padding: "3rem 2.5rem",
                    maxWidth: "480px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: "1rem",
                        letterSpacing: "-1px",
                    }}
                >
                    Clients
                </h1>
                <p
                    style={{
                        fontSize: "1.2rem",
                        color: "#64748b",
                        marginBottom: "2.5rem",
                        textAlign: "center",
                    }}
                >
                    Welcome to the Clients page. Start building your client management UI here!
                </p>
                <button
                    style={{
                        background: "linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        padding: "0.75rem 2rem",
                        border: "none",
                        borderRadius: "0.75rem",
                        boxShadow: "0 2px 8px rgba(99,102,241,0.12)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                >
                    + Add New Client
                </button>
                <div
                    style={{
                        marginTop: "2.5rem",
                        width: "100%",
                        borderTop: "1px solid #e2e8f0",
                        paddingTop: "1.5rem",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "1rem",
                    }}
                >
                    <span>No clients yet.</span>
                </div>
            </div>
        </main>
    );
}