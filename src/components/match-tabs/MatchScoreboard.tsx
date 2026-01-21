import { useState } from 'react'
import type { Match, MatchParticipant } from '../../types'

interface MatchScoreboardProps {
  match: Match
  participants: MatchParticipant[]
}

interface Game {
  number: number
  team1: MatchParticipant[]
  team2: MatchParticipant[]
  team1Goals: number
  team2Goals: number
  status: 'pending' | 'in_progress' | 'finished'
}

function MatchScoreboard({ match }: MatchScoreboardProps) {
  const [games, setGames] = useState<Game[]>(() => {
    const initialGames: Game[] = []
    for (let i = 1; i <= match.games_count; i++) {
      initialGames.push({
        number: i,
        team1: [],
        team2: [],
        team1Goals: 0,
        team2Goals: 0,
        status: 'pending',
      })
    }
    return initialGames
  })

  const [selectedGame, setSelectedGame] = useState<number>(1)
  const currentGame = games.find(g => g.number === selectedGame)

  const updateGameScore = (gameNumber: number, team: 1 | 2, goals: number) => {
    setGames(games.map(g =>
      g.number === gameNumber
        ? team === 1
          ? { ...g, team1Goals: goals }
          : { ...g, team2Goals: goals }
        : g
    ))
  }

  const updateGameStatus = (gameNumber: number, status: 'pending' | 'in_progress' | 'finished') => {
    setGames(games.map(g =>
      g.number === gameNumber
        ? { ...g, status }
        : g
    ))
  }

  return (
    <div className="row g-4">
      {/* Partida em Andamento */}
      <div className="col-lg-8">
        {currentGame && (
          <div className="card bg-dark border-warning">
            <div className="card-header bg-dark border-warning">
              <h5 className="text-warning fw-bold mb-0">
                ⚽ Jogo {currentGame.number} de {match.games_count}
              </h5>
            </div>
            <div className="card-body">
              {/* Status */}
              <div className="mb-4">
                <label className="form-label text-warning fw-bold">Status</label>
                <div className="btn-group w-100" role="group">
                  {(['pending', 'in_progress', 'finished'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      className={`btn ${currentGame.status === status ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => updateGameStatus(currentGame.number, status)}
                    >
                      {status === 'pending' && '⏳ Pendente'}
                      {status === 'in_progress' && '🔴 Em Andamento'}
                      {status === 'finished' && '✅ Finalizado'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Placar */}
              <div className="row align-items-center">
                <div className="col-5">
                  <div className="card bg-dark border-warning text-center py-4">
                    <h6 className="text-light small mb-3">TIME 1</h6>
                    <div className="input-group mb-3">
                      <button
                        className="btn btn-outline-warning"
                        type="button"
                        onClick={() => updateGameScore(currentGame.number, 1, Math.max(0, currentGame.team1Goals - 1))}
                      >
                        ➖
                      </button>
                      <input
                        type="number"
                        className="form-control form-control-lg text-center text-warning fw-bold"
                        value={currentGame.team1Goals}
                        onChange={(e) => updateGameScore(currentGame.number, 1, parseInt(e.target.value) || 0)}
                        style={{ fontSize: '2rem' }}
                      />
                      <button
                        className="btn btn-outline-warning"
                        type="button"
                        onClick={() => updateGameScore(currentGame.number, 1, currentGame.team1Goals + 1)}
                      >
                        ➕
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-2 text-center">
                  <h2 className="text-warning fw-bold">vs</h2>
                </div>

                <div className="col-5">
                  <div className="card bg-dark border-warning text-center py-4">
                    <h6 className="text-light small mb-3">TIME 2</h6>
                    <div className="input-group mb-3">
                      <button
                        className="btn btn-outline-warning"
                        type="button"
                        onClick={() => updateGameScore(currentGame.number, 2, Math.max(0, currentGame.team2Goals - 1))}
                      >
                        ➖
                      </button>
                      <input
                        type="number"
                        className="form-control form-control-lg text-center text-warning fw-bold"
                        value={currentGame.team2Goals}
                        onChange={(e) => updateGameScore(currentGame.number, 2, parseInt(e.target.value) || 0)}
                        style={{ fontSize: '2rem' }}
                      />
                      <button
                        className="btn btn-outline-warning"
                        type="button"
                        onClick={() => updateGameScore(currentGame.number, 2, currentGame.team2Goals + 1)}
                      >
                        ➕
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado */}
              <div className="alert alert-dark border-warning mt-4 text-center" role="alert">
                <p className="text-light mb-0">
                  <strong>Resultado:</strong>
                  {currentGame.team1Goals > currentGame.team2Goals && (
                    <span className="text-warning ms-2">TIME 1 VENCEU! 🎉</span>
                  )}
                  {currentGame.team2Goals > currentGame.team1Goals && (
                    <span className="text-warning ms-2">TIME 2 VENCEU! 🎉</span>
                  )}
                  {currentGame.team1Goals === currentGame.team2Goals && (
                    <span className="text-warning ms-2">EMPATE! ⚖️</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Histórico de Jogos */}
      <div className="col-lg-4">
        <h5 className="text-warning fw-bold mb-3">📊 Histórico de Jogos</h5>
        <div className="d-flex flex-column gap-2">
          {games.map(game => (
            <button
              key={game.number}
              className={`btn text-start p-3 ${
                selectedGame === game.number
                  ? 'btn-warning text-dark'
                  : 'btn-outline-warning text-light'
              }`}
              onClick={() => setSelectedGame(game.number)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Jogo {game.number}</strong>
                  <div className="small">
                    {game.team1Goals} x {game.team2Goals}
                  </div>
                </div>
                <span className="badge bg-secondary">
                  {game.status === 'pending' && '⏳'}
                  {game.status === 'in_progress' && '🔴'}
                  {game.status === 'finished' && '✅'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Resumo Final */}
        <div className="card bg-dark border-warning mt-4">
          <div className="card-header bg-dark border-warning">
            <h6 className="text-warning fw-bold mb-0">📈 Resumo</h6>
          </div>
          <div className="card-body">
            <p className="text-light small mb-2">
              Partidas Jogadas: <strong>{games.filter(g => g.status === 'finished').length}</strong>
            </p>
            <p className="text-light small mb-2">
              Em Andamento: <strong>{games.filter(g => g.status === 'in_progress').length}</strong>
            </p>
            <p className="text-light small mb-0">
              Pendentes: <strong>{games.filter(g => g.status === 'pending').length}</strong>
            </p>
            <hr className="border-warning my-2" />
            <p className="text-light small mb-0">
              Gols Total: <strong className="text-warning">
                {games.reduce((acc, g) => acc + g.team1Goals + g.team2Goals, 0)}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchScoreboard
