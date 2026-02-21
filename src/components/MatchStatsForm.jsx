import React, { useState } from "react";

export default function MatchStatsForm({ gameNum, teams, onGameComplete, onCancel }) {
  const [gameStats, setGameStats] = useState(
    teams.flatMap((team, teamIdx) =>
      team.map((player) => ({
        playerId: player.id,
        playerName: player.name,
        teamIdx,
        teamName: `Time ${String.fromCharCode(65 + teamIdx)}`,
        goals: 0,
        ownGoals: 0,
        fouls: 0,
        cards: "none",
      })),
    ),
  );

  function updateStat(idx, field, value) {
    const newStats = [...gameStats];
    newStats[idx][field] = value;
    setGameStats(newStats);
  }

  function submitGame() {
    onGameComplete({
      gameNum,
      timestamp: new Date().toISOString(),
      stats: gameStats,
    });
  }

  return (
    <div className="match-stats-form">
      <div className="msf-header">
        <h3 className="section-title">📊 Jogo #{gameNum}</h3>
        <button className="btn btn-sm btn-secondary" onClick={onCancel}>
          ← Voltar
        </button>
      </div>

      <div className="msf-container">
        <div className="msf-teams-grid">
          {teams.map((team, teamIdx) => (
            <div key={teamIdx} className={`msf-team-section team-${String.fromCharCode(65 + teamIdx).toLowerCase()}`}>
              <div className="msf-team-title">
                <h4>Time {String.fromCharCode(65 + teamIdx)}</h4>
                <span className="msf-team-count">{team.length} jogadores</span>
              </div>
              
              <table className="msf-team-table">
                <thead>
                  <tr>
                    <th>Jogador</th>
                    <th>⚽ Gols</th>
                    <th>🔴 Contra</th>
                    <th>🚑 Faltas</th>
                    <th>🟨 Cartão</th>
                  </tr>
                </thead>
                <tbody>
                  {gameStats
                    .filter((stat) => stat.teamIdx === teamIdx)
                    .map((stat) => {
                      const fullIdx = gameStats.findIndex(
                        (s) => s.playerId === stat.playerId && s.teamIdx === teamIdx
                      );
                      return (
                        <tr key={fullIdx} className={stat.cards !== "none" ? "has-card" : ""}>
                          <td className="msf-name">{stat.playerName}</td>
                          <td className="msf-stat">
                            <div className="stat-controls">
                              <button
                                className="stat-btn"
                                onClick={() =>
                                  updateStat(
                                    fullIdx,
                                    "goals",
                                    Math.max(0, stat.goals - 1),
                                  )
                                }
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={stat.goals}
                                onChange={(e) =>
                                  updateStat(fullIdx, "goals", Number(e.target.value))
                                }
                                className="stat-input"
                              />
                              <button
                                className="stat-btn"
                                onClick={() =>
                                  updateStat(fullIdx, "goals", stat.goals + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="msf-stat">
                            <div className="stat-controls">
                              <button
                                className="stat-btn"
                                onClick={() =>
                                  updateStat(
                                    fullIdx,
                                    "ownGoals",
                                    Math.max(0, stat.ownGoals - 1),
                                  )
                                }
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={stat.ownGoals}
                                onChange={(e) =>
                                  updateStat(fullIdx, "ownGoals", Number(e.target.value))
                                }
                                className="stat-input"
                              />
                              <button
                                className="stat-btn"
                                onClick={() =>
                                  updateStat(fullIdx, "ownGoals", stat.ownGoals + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="msf-stat">
                            <div className="stat-controls">
                              <button
                                className="stat-btn"
                                onClick={() =>
                                  updateStat(
                                    fullIdx,
                                    "fouls",
                                    Math.max(0, stat.fouls - 1),
                                  )
                                }
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={stat.fouls}
                                onChange={(e) =>
                                  updateStat(fullIdx, "fouls", Number(e.target.value))
                                }
                                className="stat-input"
                              />
                              <button
                                className="stat-btn"
                                onClick={() =>
                                  updateStat(fullIdx, "fouls", stat.fouls + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="msf-stat">
                            <select
                              className="card-select"
                              value={stat.cards}
                              onChange={(e) => updateStat(fullIdx, "cards", e.target.value)}
                            >
                              <option value="none">—</option>
                              <option value="yellow">🟨 Amarelo</option>
                              <option value="red">🔴 Vermelho</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <div className="msf-actions">
        <button
          className="btn btn-secondary"
          onClick={onCancel}
        >
          ❌ Cancelar
        </button>
        <button
          className="btn btn-success"
          onClick={submitGame}
        >
          ✅ Confirmar Jogo #{gameNum}
        </button>
      </div>
    </div>
  );
}
