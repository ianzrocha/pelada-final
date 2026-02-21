import React from "react";

export default function OrganizePlayersSection({
  organization,
  allPlayers,
  onAddPlayer,
  onMoveUp,
  onMoveDown,
  onRemove,
  onSave,
}) {
  return (
    <div className="organize-section card">
      <div className="organize-header">
        <h3 className="section-title">
          📋 Organização de Jogadores
        </h3>
        <p className="section-subtitle">
          {organization.length} jogador(es) adicionado(s)
        </p>
      </div>

      <div className="player-input-group">
        <select
          className="form-select organize-select"
          onChange={(e) => {
            onAddPlayer(e.target.value);
            e.target.value = "";
          }}
          defaultValue=""
        >
          <option value="">+ Adicionar jogador</option>
          {allPlayers
            .filter((p) => !organization.includes(p.id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} • {p.position}
              </option>
            ))}
        </select>
      </div>

      <div className="players-list">
        {organization.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">⚽</p>
            <p className="empty-text">Nenhum jogador adicionado ainda</p>
            <p className="empty-hint">Selecione jogadores do menu acima</p>
          </div>
        ) : (
          <div className="players-grid">
            {organization.map((id, i) => {
              const p = allPlayers.find((x) => x.id === id) || {
                name: "(desconhecido)",
                position: "?",
              };
              return (
                <div key={`${id}-${i}`} className="player-card">
                  <div className="player-info">
                    <div className="player-position-badge">{p.position}</div>
                    <div className="player-name">{p.name}</div>
                    <div className="player-index">#{i + 1} de {organization.length}</div>
                  </div>
                  <div className="player-actions">
                    <button
                      className="player-btn player-btn-up"
                      onClick={() => onMoveUp(i)}
                      disabled={i === 0}
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      className="player-btn player-btn-down"
                      onClick={() => onMoveDown(i)}
                      disabled={i === organization.length - 1}
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                    <button
                      className="player-btn player-btn-remove"
                      onClick={() => onRemove(i)}
                      title="Remover jogador"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="organize-actions">
        <button
          className="btn btn-primary organize-save-btn"
          onClick={onSave}
          disabled={organization.length === 0}
        >
          💾 Salvar Organização
        </button>
      </div>
    </div>
  );
}
