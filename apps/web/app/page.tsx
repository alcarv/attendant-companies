export default function HomePage() {
  return (
    <main className="hero">
      <div className="hero__content">
        <p className="eyebrow">Mattos Tech Solutions</p>
        <h1>Seu atendimento 24/7 no WhatsApp, treinado com o conteúdo da sua empresa.</h1>
        <p className="subhead">
          Centralize informações da empresa, ensine o assistente e responda clientes
          com velocidade e padrão. Comece em minutos, sem código.
        </p>
        <div className="cta">
          <a className="primary" href="/signup">
            Começar agora
          </a>
          <a className="ghost" href="/login">
            Ver demo
          </a>
        </div>
        <div className="proof">
          <div>
            <strong>+3x</strong>
            <span>respostas mais rápidas</span>
          </div>
          <div>
            <strong>1 só lugar</strong>
            <span>para FAQs e políticas</span>
          </div>
          <div>
          <strong>Meta Cloud</strong>
          <span>integração oficial</span>
        </div>
        </div>
      </div>
      <div className="hero__card">
        <div className="card">
          <div className="card__header">
            <span className="status">Conectado</span>
            <span className="pill">Meta Cloud API</span>
          </div>
          <div className="card__body">
            <p className="label">Conhecimento da empresa</p>
            <ul>
              <li>Horário, endereço e contatos</li>
              <li>Serviços, preços e prazos</li>
              <li>Políticas de troca e garantia</li>
            </ul>
            <p className="label">Resposta do agente</p>
            <div className="bubble">
              Olá! Temos horário estendido hoje até 19h. Posso agendar seu atendimento?
            </div>
          </div>
        </div>
        <div className="panel">
          <h3>Como funciona</h3>
          <ol>
            <li>Cadastre sua empresa</li>
            <li>Adicione conteúdo e FAQs</li>
            <li>Conecte o WhatsApp</li>
            <li>Atenda automaticamente</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
