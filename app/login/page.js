"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    if (err) {
      setStatus("error");
      setError(err.message);
    } else {
      setStatus("sent");
    }
  };

  return (
    <div
      style={{
        background: "#121110",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#EDEAE3",
            letterSpacing: -0.5,
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          Iron Log
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#6E6A63",
            fontFamily: "ui-monospace, monospace",
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          Full body · 4x/sem
        </div>

        {status === "sent" ? (
          <div
            style={{
              background: "#1C1A18",
              border: "1px solid #2E2B27",
              borderRadius: 10,
              padding: 16,
              color: "#7FA8C9",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Lien envoyé à <strong>{email}</strong>. Ouvre-le depuis ton téléphone pour te connecter.
          </div>
        ) : (
          <form onSubmit={submit}>
            <input
              type="email"
              required
              placeholder="ton@courriel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                background: "#1C1A18",
                border: "1px solid #2E2B27",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#EDEAE3",
                fontSize: 15,
                marginBottom: 10,
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 8,
                border: "none",
                background: status === "sending" ? "#2E2B27" : "#B5453B",
                color: status === "sending" ? "#6E6A63" : "#EDEAE3",
                fontWeight: 800,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                fontSize: 13,
              }}
            >
              {status === "sending" ? "Envoi..." : "Recevoir le lien"}
            </button>
            {status === "error" && (
              <div style={{ color: "#D97D75", fontSize: 12, marginTop: 10, textAlign: "center" }}>{error}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
