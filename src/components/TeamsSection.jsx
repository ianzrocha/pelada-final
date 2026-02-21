import React from "react";
import StarRating from "./StarRating";

function skillToStars(val) {
  return Math.round(val);
}

export default function TeamsSection({ teams, onBuildTeams }) {
  const hasTeams = (teams.a && teams.a.length > 0) || (teams.b && teams.b.length > 0);

  return (
    <div className="teams-section card">
      <div className="teams-header">
        <h3 className="section-title">⚔️ Divisão de Times</h3>
        <p className="section-subtitle">
          {hasTeams
            ? `Time A: ${teams.a?.length || 0} | Time B: ${teams.b?.length || 0}`
            : "Clique em 'Montar Times' para dividir"}
        </p>
      </div>

      {!hasTeams ? (
        <div className="teams-empty">
          <p className="empty-icon">🏟️</p>
          <p className="empty-text">Times ainda não montados</p>
          <button
            className="btn btn-warning team-build-btn"
            onClick={onBuildTeams}
          >
            ⚙️ Montar Times
          </button>
        </div>
      ) : (
        <>
          <div className="teams-grid">
            {/* Team A */}
            <div className="team-card team-a">
              <div className="team-header-section">
                <h4 className="team-name">Time A</h4>
                <div className="team-stats">
                  <span className="team-count">{teams.a?.length || 0}</span>
                </div>
              </div>

              <div className="team-skill">
                <div className="skill-label">Nível Médio</div>
                <StarRating value={skillToStars(teams.avgA)} readonly />
              </div>

              <div className="team-roster">
                {teams.a && teams.a.length > 0 ? (
                  teams.a.map((p, i) => (
                    <div key={p.id} className="roster-item">
                      <div className="roster-number">{i + 1}</div>
                      <div className="roster-info">
                        <div className="roster-name">{p.name}</div>
                        <div className="roster-position">{p.position}</div>
                      </div>
                      <div className="roster-skill">
                        <span className="skill-badge" title="Habilidade">
                          ⭐
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="team-empty">Sem jogadores</p>
                )}
              </div>
            </div>

            {/* Team B */}
            <div className="team-card team-b">
              <div className="team-header-section">
                <h4 className="team-name">Time B</h4>
                <div className="team-stats">
                  <span className="team-count">{teams.b?.length || 0}</span>
                </div>
              </div>

              <div className="team-skill">
                <div className="skill-label">Nível Médio</div>
                <StarRating value={skillToStars(teams.avgB)} readonly />
              </div>

              <div className="team-roster">
                {teams.b && teams.b.length > 0 ? (
                  teams.b.map((p, i) => (
                    <div key={p.id} className="roster-item">
                      <div className="roster-number">{i + 1}</div>
                      <div className="roster-info">
                        <div className="roster-name">{p.name}</div>
                        <div className="roster-position">{p.position}</div>
                      </div>
                      <div className="roster-skill">
                        <span className="skill-badge" title="Habilidade">
                          ⭐
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="team-empty">Sem jogadores</p>
                )}
              </div>
            </div>
          </div>

          <div className="teams-actions">
            <button
              className="btn btn-secondary team-remount-btn"
              onClick={onBuildTeams}
            >
              🔄 Remontar Times
            </button>
          </div>
        </>
      )}
    </div>
  );
}
