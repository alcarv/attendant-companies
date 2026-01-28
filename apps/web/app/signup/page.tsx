"use client";

import { useState } from "react";
import { apiFetch, setToken } from "../lib/api";

export default function SignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch<{ token: string }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          companyName,
          industry,
          timezone,
          name,
          email,
          password
        })
      });
      setToken(data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Criar conta</h1>
        <p className="muted">Configure sua empresa e comece a atender no WhatsApp.</p>
        <label>
          Empresa
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            required
          />
        </label>
        <label>
          Segmento
          <input value={industry} onChange={(event) => setIndustry(event.target.value)} />
        </label>
        <label>
          Fuso horário
          <input value={timezone} onChange={(event) => setTimezone(event.target.value)} />
        </label>
        <label>
          Seu nome
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
        <a className="link" href="/login">
          Já tenho conta
        </a>
      </form>
    </main>
  );
}
