import { useState } from 'react'
import type { Match } from '../types'
import MatchDetail from './MatchDetail'

interface MatchCardProps {
  match: Match
  onRemove: (id: number) => void
}

function MatchCard({ match, onRemove }: MatchCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const matchDate = new Date(match.match_date).toLocaleDateString('pt-BR')

  return (
    <>
      <div
        className="card bg-dark border-warning shadow-lg"
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <h5 className="card-title text-warning fw-bold mb-2">{match.title}</h5>
              <div className="d-flex gap-2">
                <span className="badge bg-secondary">📅 {matchDate}</span>
                <span className="badge bg-info">⚽ {match.games_count} jogo{match.games_count > 1 ? 's' : ''}</span>
                <span className={`badge ${
                  match.status === 'finished' ? 'bg-success' :
                  match.status === 'in_progress' ? 'bg-warning' :
                  'bg-secondary'
                }`}>
                  {match.status === 'finished' ? '✅ Finalizada' :
                   match.status === 'in_progress' ? '🔴 Em Andamento' :
                   '⏳ Pendente'}
                </span>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(match.id!)
              }}
            >
              🗑️
            </button>
          </div>

          {match.description && (
            <>
              <hr className="border-warning" />
              <p className="text-light small mb-3">{match.description}</p>
            </>
          )}

          <div className="row mt-4">
            <div className="col-md-3 mb-2">
              <button
                className="btn btn-sm btn-outline-warning w-100"
                onClick={() => setShowDetail(true)}
              >
                📋 Organização
              </button>
            </div>
            <div className="col-md-3 mb-2">
              <button
                className="btn btn-sm btn-outline-warning w-100"
                onClick={() => setShowDetail(true)}
              >
                👥 Times
              </button>
            </div>
            <div className="col-md-3 mb-2">
              <button
                className="btn btn-sm btn-outline-warning w-100"
                onClick={() => setShowDetail(true)}
              >
                ⚽ Partida
              </button>
            </div>
            <div className="col-md-3 mb-2">
              <button
                className="btn btn-sm btn-outline-warning w-100"
                onClick={() => setShowDetail(true)}
              >
                📊 Resultados
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetail && (
        <MatchDetail match={match} onClose={() => setShowDetail(false)} />
      )}
    </>
  )
}

export default MatchCard
