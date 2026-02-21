import React, { useState } from "react";
import StarRating from "./StarRating";

function avgSkill(p) {
  return ((p.offense || 0) + (p.defense || 0) + (p.speed || 0)) / 3;
}

export default function TeamManager({
  allPlayers,
  organization,
  onSave,
}) {
  const [teams, setTeams] = useState([]);
  const [numTeams, setNumTeams] = useState(2);
  const [swapMode, setSwapMode] = useState(false);
  const [selectedTeams] = useState([0, 1]);

  // Calcula máximo de times (6 outfield + 1 goleiro per time)
  function getMaxTeams() {
    const keepers = organization
      .map((id) => allPlayers.find((p) => p.id === id))
      .filter(Boolean)
      .filter((p) => p.position === "goleiro").length;
    
    const others = organization
      .map((id) => allPlayers.find((p) => p.id === id))
      .filter(Boolean)
      .filter((p) => p.position !== "juiz" && p.position !== "goleiro").length;

    // Máximo de times = quantidade de goleiros disponíveis
    // Mas também precisa de pelo menos 6 jogadores por time
    if (keepers === 0) return 1;
    
    const maxByKeepers = keepers;
    const maxByPlayers = Math.floor(others / 6);
    
    return Math.min(maxByKeepers, maxByPlayers);
  }

  function buildTeams() {
    const roster = organization
      .map((id) => allPlayers.find((p) => p.id === id))
      .filter(Boolean);

    if (!roster.length) return;

    const keepers = roster.filter((p) => p.position === "goleiro");
    const others = roster.filter(
      (p) => p.position !== "juiz" && p.position !== "goleiro",
    );

    const players = others.map((p) => ({ ...p, skill: avgSkill(p) }));
    players.sort((a, b) => b.skill - a.skill);

    const newTeams = Array.from({ length: numTeams }, () => []);
    const avg = (arr) =>
      arr.length ? arr.reduce((s, x) => s + avgSkill(x), 0) / arr.length : 0;

    players.forEach((pl) => {
      const teamAverages = newTeams.map((t) => avg(t));
      const minAvgIdx = teamAverages.indexOf(Math.min(...teamAverages));
      const minLengthIdx = newTeams.findIndex((t) => t.length === Math.min(...newTeams.map((x) => x.length)));
      
      if (newTeams[minAvgIdx].length < Math.ceil(players.length / numTeams)) {
        newTeams[minAvgIdx].push(pl);
      } else {
        newTeams[minLengthIdx].push(pl);
      }
    });

    // Adicionar goleiros
    if (keepers.length) {
      keepers.forEach((k, i) => {
        if (i < newTeams.length) newTeams[i].unshift(k);
        else newTeams[0].push(k);
      });
    }

    setTeams(newTeams);
  }

  function swapPlayer(fromTeamIdx, playerIdx, toTeamIdx) {
    if (fromTeamIdx === toTeamIdx) return;
    const newTeams = teams.map((t) => [...t]);
    const player = newTeams[fromTeamIdx][playerIdx];
    newTeams[fromTeamIdx].splice(playerIdx, 1);
    newTeams[toTeamIdx].push(player);
    setTeams(newTeams);
  }

  function remountTeams() {
    const selectedTeamsPlayers = [
      ...teams[selectedTeams[0]],
      ...teams[selectedTeams[1]],
    ];

    const keepers = selectedTeamsPlayers.filter((p) => p.position === "goleiro");
    const others = selectedTeamsPlayers.filter(
      (p) => p.position !== "juiz" && p.position !== "goleiro",
    );

    const playersToBalance = others.map((p) => ({ ...p, skill: avgSkill(p) }));
    playersToBalance.sort((a, b) => b.skill - a.skill);

    const newTeamA = [];
    const newTeamB = [];
    const avg = (arr) =>
      arr.length ? arr.reduce((s, x) => s + avgSkill(x), 0) / arr.length : 0;

    playersToBalance.forEach((pl) => {
      const aAvg = avg(newTeamA);
      const bAvg = avg(newTeamB);
      if (
        (newTeamA.length < newTeamB.length && newTeamA.length < 6) ||
        (newTeamA.length < 6 && aAvg <= bAvg)
      ) {
        newTeamA.push(pl);
      } else if (newTeamB.length < 6) {
        newTeamB.push(pl);
      } else if (newTeamA.length < 6) {
        newTeamA.push(pl);
      } else {
        newTeamA.push(pl);
      }
    });

    if (keepers.length) {
      if (keepers[0]) newTeamA.unshift(keepers[0]);
      if (keepers[1]) newTeamB.unshift(keepers[1]);
      for (let i = 2; i < keepers.length; i++) newTeamA.push(keepers[i]);
    }

    const newTeams = [...teams];
    newTeams[selectedTeams[0]] = newTeamA;
    newTeams[selectedTeams[1]] = newTeamB;
    setTeams(newTeams);
  }

  return (
    <div className="team-manager">
      <div className="tm-header">
        <h3 className="section-title">⚔️ Gerenciador de Times</h3>
      </div>

      {teams.length === 0 ? (
        <div className="tm-config">
          <div className="tm-config-group">
            <label className="tm-label">Quantidade de Times:</label>
            <select
              className="tm-select"
              value={numTeams}
              onChange={(e) => setNumTeams(Number(e.target.value))}
            >
              {Array.from({ length: Math.max(1, getMaxTeams()) }, (_, i) => i + 2).map((n) => (
                <option key={n} value={n}>
                  {n} times
                </option>
              ))}
            </select>
            <p className="tm-helper-text">
              Máximo: {getMaxTeams()} time(s) possível(is) com {organization.length} jogadores
            </p>
          </div>
          <button className="btn btn-warning tm-build-btn" onClick={buildTeams}>
            ⚙️ Montar Times
          </button>
        </div>
      ) : (
        <>
          <div className="tm-teams-list">
            {teams.map((team, idx) => (
              <div key={idx} className="tm-team-box">
                <div className="tm-team-header">
                  <h4 className="tm-team-name">Time {String.fromCharCode(65 + idx)}</h4>
                  <span className="tm-team-count">{team.length}</span>
                </div>
                <div className="tm-team-players">
                  {team.map((p, pidx) => (
                    <div key={`${p.id}-${pidx}`} className="tm-player-item">
                      <div className="tm-player-info">
                        <div className="tm-player-name">{p.name}</div>
                        <div className="tm-player-pos">{p.position}</div>
                      </div>
                      {swapMode && (
                        <div className="tm-swap-buttons">
                          {teams.map((_, tidx) => (
                            tidx !== idx && (
                              <button
                                key={tidx}
                                className="tm-swap-btn"
                                onClick={() => swapPlayer(idx, pidx, tidx)}
                                title={`Mover para Time ${String.fromCharCode(65 + tidx)}`}
                              >
                                →T{String.fromCharCode(65 + tidx)}
                              </button>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="tm-actions">
            <button
              className={`btn ${swapMode ? "btn-secondary" : "btn-primary"}`}
              onClick={() => setSwapMode(!swapMode)}
            >
              {swapMode ? "❌ Cancelar Troca" : "↔️ Trocar Jogadores"}
            </button>
            <button className="btn btn-secondary" onClick={remountTeams}>
              🔄 Remontar Times
            </button>
            <button className="btn btn-warning" onClick={() => onSave(teams)}>
              💾 Salvar Times
            </button>
          </div>
        </>
      )}
    </div>
  );
}
