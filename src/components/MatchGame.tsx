import { useState, useEffect } from 'react'
import type { MatchResult } from '../types'
import * as api from '../services/api'

interface MatchGameProps {
  matchId: number
}

function MatchGame({ matchId }: MatchGameProps) {
  const [results, setResults] = useState<MatchResult[]>([])

  useEffect(() => {
    loadData()
  }, [matchId])

  const loadData = async () => {
    const data = await api.getMatchResults(matchId)
    setResults(data)
  }

  const handleGoal = async (resultId: number, team: 1 | 2, action: 'goal' | 'own') => {
    const result = results.find(r => r.id === resultId)
    if (!result) return

    const updated = {
      team1_goals: result.team1_goals,
      team2_goals: result.team2_goals,
    }

    if (team === 1) {
      updated[action === 'goal' ? 'team1_goals' : 'team2_goals']++
    } else {
      updated[action === 'goal' ? 'team2_goals' : 'team1_goals']++
    }

    // Aqui você faria a chamada para atualizar no backend
    // await api.updateMatchResult(resultId, updated)
    loadData()
  }

  const inProgressGames = results.filter(r => r.status === 'in_progress')
  const finishedGames = results.filter(r => r.status === 'finished')

  return (
    <div className="p-4">
      <div className="row">
        {/* Jogo em Andamento */}
        <div className="col-lg-8">
          <h5 className="text-warning mb-4">🔴 Partida em Andamento</h5>

          {inProgressGames.length > 0 ? (
            inProgressGames.map(game => (
              <div key={game.id} className="card bg-dark border-warning mb-3">
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-5">
                      <h6 className="text-light mb-3">Time 1</h6>
                      <div className="display-4 text-warning fw-bold mb-3">{game.team1_goals}</div>
                      <div className="d-grid gap-2">
                        <button className="btn btn-sm btn-success" onClick={() => handleGoal(game.id, 1, 'goal')}>
                          ⚽ Gol
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleGoal(game.id, 1, 'own')}>
                          🔄 Contra
                        </button>
                      </div>
                    </div>

                    <div className="col-md-2 d-flex align-items-center justify-content-center">
                      <h4 className="text-light">VS</h4>
                    </div>

                    <div className="col-md-5">
                      <h6 className="text-light mb-3">Time 2</h6>
                      <div className="display-4 text-warning fw-bold mb-3">{game.team2_goals}</div>
                      <div className="d-grid gap-2">
                        <button className="btn btn-sm btn-success" onClick={() => handleGoal(game.id, 2, 'goal')}>
                          ⚽ Gol
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleGoal(game.id, 2, 'own')}>
                          🔄 Contra
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-warning" />

                  <div className="d-grid gap-2">
                    <button className="btn btn-warning fw-bold">✅ Finalizar Jogo</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card bg-dark border-warning text-center py-5">
              <p className="text-light mb-0">Nenhuma partida em andamento</p>
            </div>
          )}
        </div>

        {/* Histórico de Jogos */}
        <div className="col-lg-4">
          <h5 className="text-warning mb-4">✅ Partidas Finalizadas</h5>

          {finishedGames.length > 0 ? (
            <div className="list-group list-group-flush">
              {finishedGames.map(game => (
                <a
                  key={game.id}
                  href="#"
                  className="list-group-item list-group-item-action bg-dark border-warning text-decoration-none"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-light mb-1">Jogo {game.game_number}</h6>
                      <small className="text-muted">Finalizada</small>
                    </div>
                    <div className="text-end">
                      <h5 className="text-warning mb-0">
                        {game.team1_goals} x {game.team2_goals}
                      </h5>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="card bg-dark border-warning text-center py-4">
              <p className="text-light small mb-0">Nenhuma partida finalizada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchGame
