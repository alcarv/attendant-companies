"use client";

import { useState } from "react";
import { apiFetch, setToken } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <div className="auth__panel">
        <div className="auth__brand">
          <span className="eyebrow">Mattos Tech Solutions</span>
          <h1>Bem-vindo de volta</h1>
          <p className="muted">
            Acesse seu painel, revise o conhecimento da empresa e acompanhe o atendimento em
            tempo real.
          </p>
          <div className="auth__highlights">
            <div>
              <strong>Respostas consistentes</strong>
              <span>com base no conteúdo da sua marca.</span>
            </div>
            <div>
              <strong>WhatsApp oficial</strong>
              <span>integração direta com Meta Cloud.</span>
            </div>
          </div>
        </div>
        <form className="card form auth__form" onSubmit={handleSubmit}>
          <h2>Entrar</h2>
          <p className="muted">Use seu email corporativo para continuar.</p>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="auth__footer">
            <span className="muted">Ainda não tem conta?</span>
            <a className="link" href="/signup">
              Criar conta
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
