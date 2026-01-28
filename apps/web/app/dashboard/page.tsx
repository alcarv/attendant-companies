"use client";

import { useEffect, useState } from "react";
import { apiFetch, clearToken } from "../lib/api";

type Company = {
  id: string;
  name: string;
  industry: string | null;
  timezone: string | null;
};

type Knowledge = {
  id: string;
  title: string;
  content: string;
  type: string;
};

type WhatsAppConfig = {
  phoneNumberId: string;
  businessId: string;
  accessToken: string;
  verifyToken: string;
};

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [companyForm, setCompanyForm] = useState({
    name: "",
    industry: "",
    timezone: ""
  });

  const [knowledgeForm, setKnowledgeForm] = useState({
    title: "",
    content: ""
  });

  const [configForm, setConfigForm] = useState({
    phoneNumberId: "",
    businessId: "",
    accessToken: "",
    verifyToken: ""
  });

  useEffect(() => {
    async function load() {
      try {
        const companyData = await apiFetch<Company>("/company/me");
        setCompany(companyData);
        setCompanyForm({
          name: companyData.name ?? "",
          industry: companyData.industry ?? "",
          timezone: companyData.timezone ?? ""
        });

        const knowledgeData = await apiFetch<Knowledge[]>("/knowledge");
        setKnowledge(knowledgeData);

        const configData = await apiFetch<WhatsAppConfig | null>("/whatsapp/config");
        if (configData) {
          setConfig(configData);
          setConfigForm({
            phoneNumberId: configData.phoneNumberId ?? "",
            businessId: configData.businessId ?? "",
            accessToken: configData.accessToken ?? "",
            verifyToken: configData.verifyToken ?? ""
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar");
      }
    }

    load();
  }, []);

  async function updateCompany(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const updated = await apiFetch<Company>("/company/me", {
        method: "PUT",
        body: JSON.stringify(companyForm)
      });
      setCompany(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar empresa");
    }
  }

  async function addKnowledge(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const created = await apiFetch<Knowledge>("/knowledge", {
        method: "POST",
        body: JSON.stringify({
          title: knowledgeForm.title,
          content: knowledgeForm.content,
          type: "TEXT"
        })
      });
      setKnowledge([created, ...knowledge]);
      setKnowledgeForm({ title: "", content: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar conhecimento");
    }
  }

  async function saveConfig(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const saved = await apiFetch<WhatsAppConfig>("/whatsapp/config", {
        method: "POST",
        body: JSON.stringify(configForm)
      });
      setConfig(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar configuração");
    }
  }

  function handleLogout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <main className={`dashboard ${collapsed ? "dashboard--collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          <p className="eyebrow">Mattos Tech Solutions</p>
          <h2>Console</h2>
          <p className="sidebar__meta">Operação central</p>
        </div>
        <button
          className="sidebar__toggle"
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expandir menu" : "Minimizar menu"}
        >
          <span className="sidebar__arrow">{collapsed ? "›" : "‹"}</span>
        </button>
        <nav className="sidebar__nav">
          <a className="sidebar__link active" href="/dashboard">
            <span className="sidebar__icon">◆</span>
            <span className="sidebar__label">Visão geral</span>
          </a>
          <a className="sidebar__link" href="/dashboard#empresa">
            <span className="sidebar__icon">◼</span>
            <span className="sidebar__label">Empresa</span>
          </a>
          <a className="sidebar__link" href="/dashboard#whatsapp">
            <span className="sidebar__icon">●</span>
            <span className="sidebar__label">WhatsApp</span>
          </a>
          <a className="sidebar__link" href="/dashboard#conhecimento">
            <span className="sidebar__icon">▲</span>
            <span className="sidebar__label">Conhecimento</span>
          </a>
        </nav>
        <div className="sidebar__footer">
          <button className="ghost sidebar__logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <section className="dashboard__main">
        <header className="dashboard__header">
          <div>
            <p className="eyebrow">Painel</p>
            <h1>Visão geral</h1>
            <p className="muted">Configure sua operação e acompanhe o desempenho.</p>
          </div>
          <div className="dashboard__actions">
            <button className="ghost" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="dashboard__top">
        <div className="card dashboard__hero">
          <h2>Resumo</h2>
          <p className="muted">
            {company?.name
              ? `Operação ativa para ${company.name}.`
              : "Finalize o cadastro da empresa para liberar o atendente."}
          </p>
          <div className="stats">
            <div>
              <strong>{knowledge.length}</strong>
              <span>itens de conhecimento</span>
            </div>
            <div>
              <strong>{config ? "Conectado" : "Pendente"}</strong>
              <span>WhatsApp</span>
            </div>
            <div>
              <strong>{company?.timezone ?? "—"}</strong>
              <span>fuso horário</span>
            </div>
          </div>
        </div>

        <div className="card dashboard__quick">
          <h2>Checklist</h2>
          <ul className="checklist">
            <li className={company?.name ? "done" : ""}>Cadastro da empresa</li>
            <li className={knowledge.length > 0 ? "done" : ""}>Conhecimento inicial</li>
            <li className={config ? "done" : ""}>WhatsApp conectado</li>
          </ul>
          <p className="muted">
            Complete os itens acima para ativar o atendimento automático.
          </p>
        </div>
      </section>

      <section className="grid" id="empresa">
        <div className="card">
          <div className="card__header-row">
            <div>
              <h2>Dados da empresa</h2>
              <p className="muted">Mantenha as informações sempre atualizadas.</p>
            </div>
          </div>
          <form className="form" onSubmit={updateCompany}>
            <label>
              Nome
              <input
                value={companyForm.name}
                onChange={(event) =>
                  setCompanyForm({ ...companyForm, name: event.target.value })
                }
                required
              />
            </label>
            <label>
              Segmento
              <input
                value={companyForm.industry}
                onChange={(event) =>
                  setCompanyForm({ ...companyForm, industry: event.target.value })
                }
              />
            </label>
            <label>
              Fuso horário
              <input
                value={companyForm.timezone}
                onChange={(event) =>
                  setCompanyForm({ ...companyForm, timezone: event.target.value })
                }
              />
            </label>
            <button className="primary" type="submit">
              Salvar
            </button>
          </form>
        </div>

        <div className="card" id="whatsapp">
          <div className="card__header-row">
            <div>
              <h2>Configuração WhatsApp</h2>
              <p className="muted">Conecte com a Meta Cloud API.</p>
            </div>
            <span className={config ? "status" : "status status--pending"}>
              {config ? "Conectado" : "Pendente"}
            </span>
          </div>
          <form className="form" onSubmit={saveConfig}>
            <label>
              Phone Number ID
              <input
                value={configForm.phoneNumberId}
                onChange={(event) =>
                  setConfigForm({ ...configForm, phoneNumberId: event.target.value })
                }
                required
              />
            </label>
            <label>
              Business ID
              <input
                value={configForm.businessId}
                onChange={(event) =>
                  setConfigForm({ ...configForm, businessId: event.target.value })
                }
                required
              />
            </label>
            <label>
              Access Token
              <input
                value={configForm.accessToken}
                onChange={(event) =>
                  setConfigForm({ ...configForm, accessToken: event.target.value })
                }
                required
              />
            </label>
            <label>
              Verify Token
              <input
                value={configForm.verifyToken}
                onChange={(event) =>
                  setConfigForm({ ...configForm, verifyToken: event.target.value })
                }
                required
              />
            </label>
            <button className="primary" type="submit">
              Salvar
            </button>
          </form>
        </div>
      </section>

      <section className="card" id="conhecimento">
        <div className="card__header-row">
          <div>
            <h2>Conhecimento da empresa</h2>
            <p className="muted">
              Adicione informações que o assistente deve saber.
            </p>
          </div>
          <span className="pill">{knowledge.length} itens</span>
        </div>
        <div className="knowledge__layout">
          <form className="form" onSubmit={addKnowledge}>
            <label>
              Título
              <input
                value={knowledgeForm.title}
                onChange={(event) =>
                  setKnowledgeForm({ ...knowledgeForm, title: event.target.value })
                }
                required
              />
            </label>
            <label>
              Conteúdo
              <textarea
                rows={5}
                value={knowledgeForm.content}
                onChange={(event) =>
                  setKnowledgeForm({ ...knowledgeForm, content: event.target.value })
                }
                required
              />
            </label>
            <button className="primary" type="submit">
              Adicionar conhecimento
            </button>
          </form>
          <div className="knowledge">
            {knowledge.length === 0 ? (
              <p className="muted">Nenhuma informação cadastrada.</p>
            ) : (
              knowledge.map((item) => (
                <div key={item.id} className="knowledge__item">
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      </section>
    </main>
  );
}
