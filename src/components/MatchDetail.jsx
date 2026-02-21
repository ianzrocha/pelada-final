import React, { useEffect, useState } from "react";
import { getParticipants } from "../services/storage";
import OrganizePlayersSection from "./OrganizePlayersSection";
import TeamManager from "./TeamManager";
import MatchStatsForm from "./MatchStatsForm";

export default function MatchDetail({ match, onSave }) {
  const [org, setOrg] = useState(match.organization || []);
  const [allPlayers, setAllPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState(match.games || []);
  const [currentGameNum, setCurrentGameNum] = useState(1);
  const [showStatsForm, setShowStatsForm] = useState(false);

  useEffect(() => {
    (async () => {
      setAllPlayers(await getParticipants());
    })();
  }, []);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setOrg(match.organization || []);
    setGames(match.games || []);
  }, [match]);

  function moveUp(i) {
    if (i <= 0) return;
    const copy = [...org];
    [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
    setOrg(copy);
  }

  function moveDown(i) {
    if (i >= org.length - 1) return;
    const copy = [...org];
    [copy[i + 1], copy[i]] = [copy[i], copy[i + 1]];
    setOrg(copy);
  }

  function removeAt(i) {
    const copy = [...org];
    copy.splice(i, 1);
    setOrg(copy);
  }

  function addPlayer(id) {
    if (!id) return;
    setOrg((s) => [...s, id]);
  }

  function saveDayParticipants() {
    const payload = { ...match, organization: org };
    onSave(payload);
  }

  function handleTeamsSaved(newTeams) {
    setTeams(newTeams);
  }

  function handleGameComplete(gameData) {
    const newGames = [...games, gameData];
    setGames(newGames);
    setCurrentGameNum(currentGameNum + 1);
    setShowStatsForm(false);
  }

  function handleCancelGame() {
    setShowStatsForm(false);
  }

  function saveAllResults() {
    const payload = {
      ...match,
      organization: org,
      teams: teams,
      games: games,
    };
    onSave(payload);
  }

  return (
    <div className="match-detail-container">
      <OrganizePlayersSection
        organization={org}
        allPlayers={allPlayers}
        onAddPlayer={addPlayer}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
        onRemove={removeAt}
        onSave={saveDayParticipants}
      />

      {org.length > 0 && (
        <TeamManager
          allPlayers={allPlayers}
          organization={org}
          onSave={handleTeamsSaved}
          onBuildTeams={() => {}}
        />
      )}

      {teams.length > 0 && (
        <div className="match-games-section card">
          {!showStatsForm ? (
            <div className="games-summary">
              <div className="summary-header">
                <h3 className="section-title">🎮 Resultado das Partidas</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowStatsForm(true)}
                >
                  ➕ Jogo #{currentGameNum}
                </button>
              </div>

              {games.length > 0 && (
                <div className="games-history">
                  <h4>Jogos Concluídos:</h4>
                  {games.map((game, idx) => (
                    <div key={idx} className="game-summary-item">
                      <div className="game-num">Jogo #{game.gameNum}</div>
                      <div className="game-stats">
                        {game.stats
                          .filter((s) => s.goals > 0 || s.ownGoals > 0)
                          .map((s) => (
                            <span key={s.playerId} className="scorer-badge">
                              {s.playerName}: {s.goals}⚽
                              {s.ownGoals > 0 && ` +${s.ownGoals}🔴`}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="save-results-btn">
                <button
                  className="btn btn-success"
                  onClick={saveAllResults}
                  disabled={games.length === 0}
                >
                  💾 Salvar Todos os Jogos
                </button>
              </div>
            </div>
          ) : (
            <MatchStatsForm
              gameNum={currentGameNum}
              teams={teams}
              onGameComplete={handleGameComplete}
              onCancel={handleCancelGame}
            />
          )}
        </div>
      )}
    </div>
  );
}
