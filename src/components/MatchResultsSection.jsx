import React, { useState } from "react";

export default function MatchResultsSection({
  match,
  results,
  teams,
  allPlayers,
  onAddResult,
  onSave,
}) {
  const [creating, setCreating] = useState(false);
  const [scorerCounts, setScorerCounts] = useState({});
  const currentGameIndex = results.length + 1;

  function incScorer(id) {
    setScorerCounts((s) => ({ ...s, [id]: (s[id] || 0) + 1 }));
  }

  function decScorer(id) {
    setScorerCounts((s) => ({ ...s, [id]: Math.max(0, (s[id] || 0) - 1) }));
  }

  function confirmResult() {
    // compute scorers array and scores
    const scorers = Object.entries(scorerCounts)
      .filter(([, v]) => v > 0)
      .map(([playerId, goals]) => ({ playerId, goals }));
    // determine team membership
    const teamAIds = (teams.a || []).map((p) => p.id);
    const teamBIds = (teams.b || []).map((p) => p.id);
    let scoreA = 0,
      scoreB = 0;
    scorers.forEach((s) => {
      if (teamAIds.includes(s.playerId)) scoreA += s.goals;
      else if (teamBIds.includes(s.playerId)) scoreB += s.goals;
    });
    const newResult = { game: results.length + 1, scoreA, scoreB, scorers };
    onAddResult(newResult);
    setCreating(false);
    setScorerCounts({});
  }

  function cancelCreating() {
    setCreating(false);
    setScorerCounts({});
  }

  const totalScoreA = results.reduce((s, r) => s + r.scoreA, 0);
  const totalScoreB = results.reduce((s, r) => s + r.scoreB, 0);

  return (
    <div className="results-section card">
      <div className="results-header">
        <h3 className="section-title">🎯 Resultado da Partida</h3>
        <p className="section-subtitle">
          {match.games ? `${match.games} jogo(s) agendado(s)` : "Sem informação de jogos"}
        </p>
      </div>

      {/* Score Summary */}
      {results.length > 0 && (
        <div className="score-summary">
          <div className="score-display">
            <div className="score-team score-team-a">
              <div className="score-label">Time A</div>
              <div className="score-value">{totalScoreA}</div>
              <div className="score-games">{results.length} jogo(s)</div>
            </div>
            <div className="score-separator">vs</div>
            <div className="score-team score-team-b">
              <div className="score-label">Time B</div>
              <div className="score-value">{totalScoreB}</div>
              <div className="score-games">{results.length} jogo(s)</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Result Form */}
      {!creating ? (
        <div className="results-action">
          <button
            className="btn btn-warning results-add-btn"
            onClick={() => setCreating(true)}
            disabled={!teams.a || !teams.b}
          >
            ➕ Adicionar Resultado
          </button>
        </div>
      ) : (
        <div className="result-creator">
          <div className="creator-header">
            <h4 className="creator-title">Marcar Gols - Jogo #{currentGameIndex}</h4>
            <p className="creator-hint">Clique em + ou - para marcar/desmarcar gols</p>
          </div>

          <div className="scorers-grid">
            {/* Team A Scorers */}
            <div className="scorers-column scorers-team-a">
              <div className="scorers-label">Time A</div>
              <div className="scorers-list">
                {(teams.a || []).map((p) => (
                  <div key={p.id} className="scorer-item">
                    <div className="scorer-name">{p.name}</div>
                    <div className="scorer-controls">
                      <button
                        className="scorer-btn scorer-btn-minus"
                        onClick={() => decScorer(p.id)}
                      >
                        −
                      </button>
                      <div className="scorer-count">
                        {scorerCounts[p.id] || 0}
                      </div>
                      <button
                        className="scorer-btn scorer-btn-plus"
                        onClick={() => incScorer(p.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team B Scorers */}
            <div className="scorers-column scorers-team-b">
              <div className="scorers-label">Time B</div>
              <div className="scorers-list">
                {(teams.b || []).map((p) => (
                  <div key={p.id} className="scorer-item">
                    <div className="scorer-name">{p.name}</div>
                    <div className="scorer-controls">
                      <button
                        className="scorer-btn scorer-btn-minus"
                        onClick={() => decScorer(p.id)}
                      >
                        −
                      </button>
                      <div className="scorer-count">
                        {scorerCounts[p.id] || 0}
                      </div>
                      <button
                        className="scorer-btn scorer-btn-plus"
                        onClick={() => incScorer(p.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="creator-actions">
            <button
              className="btn btn-primary creator-confirm-btn"
              onClick={confirmResult}
            >
              ✓ Confirmar Resultado
            </button>
            <button
              className="btn btn-secondary creator-cancel-btn"
              onClick={cancelCreating}
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Results History */}
      {results.length > 0 && (
        <div className="results-history">
          <h4 className="history-title">Histórico</h4>
          <div className="history-grid">
            {results.map((r, i) => (
              <div key={i} className="history-card">
                <div className="history-game-label">Jogo #{r.game}</div>
                <div className="history-score">
                  <span className="history-score-a">{r.scoreA}</span>
                  <span className="history-score-separator">×</span>
                  <span className="history-score-b">{r.scoreB}</span>
                </div>
                {r.scorers && r.scorers.length > 0 && (
                  <div className="history-scorers">
                    {r.scorers.map((s, j) => {
                      const p = allPlayers.find((x) => x.id === s.playerId);
                      return (
                        <div key={j} className="history-scorer">
                          <span className="scorer-name">{p?.name || "?"}</span>
                          <span className="scorer-goals">({s.goals}g)</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="results-save-action">
        <button className="btn btn-primary results-save-btn" onClick={onSave}>
          💾 Salvar Partida
        </button>
      </div>
    </div>
  );
}
