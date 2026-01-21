import type { Participant } from '../types'
import StarRating from './StarRating'

interface ParticipantCardProps {
  participant: Participant
  onUpdate: (id: number, participant: Partial<Participant>) => void
  onRemove: (id: number) => void
}

function ParticipantCard({ participant, onRemove }: ParticipantCardProps) {
  return (
    <div className="card bg-dark border-warning h-100 shadow-lg hover-card">
      <div className="card-body">
        <div className="mb-3">
          <h5 className="card-title text-warning fw-bold mb-1">{participant.name}</h5>
          {participant.fantasy_name && (
            <p className="text-light small mb-2">
              <em>"{participant.fantasy_name}"</em>
            </p>
          )}
          <div className="d-flex gap-2">
            <span className="badge bg-secondary">{participant.type}</span>
            <span className="badge bg-primary">{participant.position}</span>
            <span className={`badge ${participant.active ? 'bg-success' : 'bg-danger'}`}>
              {participant.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <hr className="border-warning" />

        <div className="mb-3">
          <p className="text-light small mb-2">
            <strong>Nascimento:</strong> {participant.birth_date ? new Date(participant.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
          </p>
        </div>

        <h6 className="text-warning mt-3 mb-2">Avaliações</h6>
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-light">Ofensivo</small>
            <StarRating rating={participant.offensive_rating} />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-light">Defensivo</small>
            <StarRating rating={participant.defensive_rating} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-light">Velocidade</small>
            <StarRating rating={participant.speed_rating} />
          </div>
        </div>

        <hr className="border-warning" />

        <h6 className="text-warning mt-3 mb-2">Estatísticas</h6>
        <div className="row text-center small">
          <div className="col-6 mb-2">
            <p className="text-light mb-0">{participant.goals}</p>
            <small className="text-muted">Gols</small>
          </div>
          <div className="col-6 mb-2">
            <p className="text-light mb-0">{participant.own_goals}</p>
            <small className="text-muted">Contras</small>
          </div>
          <div className="col-6 mb-2">
            <p className="text-light mb-0">{participant.fouls}</p>
            <small className="text-muted">Faltas</small>
          </div>
          <div className="col-6 mb-2">
            <p className="text-light mb-0">{participant.cards}</p>
            <small className="text-muted">Cartões</small>
          </div>
          <div className="col-12">
            <p className="text-light mb-0">{participant.matches_played}</p>
            <small className="text-muted">Partidas</small>
          </div>
        </div>

        <div className="d-grid gap-2 mt-4">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(participant.id!)}
          >
            🗑️ Remover
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParticipantCard
