import { useState, useEffect } from 'react'
import type { MatchResult } from '../types'
import * as api from '../services/api'

interface MatchResultsProps {
  matchId: number
}

function MatchResults({ matchId }: MatchResultsProps) {
  const [results, setResults] = useState<MatchResult[]>([])

  useEffect(() => {
    loadData()
  }, [matchId])

  const loadData = async () => {
    const data = await api.getMatchResults(matchId)
    setResults(data)
  }

  return (
    <div className="p-4">
      <h5 className="text-warning mb-4">📊 Resultados</h5>

      {results.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-dark">
            <thead>
              <tr>
                <th className="text-light">Jogo</th>
                <th className="text-light">Time 1</th>
                <th className="text-center text-light">Placar</th>
                <th className="text-light">Time 2</th>
                <th className="text-light">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id}>
                  <td className="text-light">{result.game_number}</td>
                  <td className="text-light small">Time 1</td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark fw-bold">
                      {result.team1_goals} x {result.team2_goals}
                    </span>
                  </td>
                  <td className="text-light small">Time 2</td>
                  <td>
                    <span
                      className={`badge ${
                        result.status === 'finished'
                          ? 'bg-success'
                          : result.status === 'in_progress'
                            ? 'bg-warning'
                            : 'bg-secondary'
                      }`}
                    >
                      {result.status === 'finished'
                        ? '✅ Finalizado'
                        : result.status === 'in_progress'
                          ? '🔴 Em Andamento'
                          : '⏳ Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card bg-dark border-warning text-center py-5">
          <p className="text-light mb-0">Nenhum resultado registrado</p>
        </div>
      )}
    </div>
  )
}

export default MatchResults
