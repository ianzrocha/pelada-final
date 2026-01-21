import { useState } from 'react'
import type { Match, MatchParticipant, Participant } from '../../types'

interface MatchOrganizationProps {
  match: Match
  participants: MatchParticipant[]
  availableParticipants: Participant[]
  onAddParticipant: (participantId: number) => void
  onRemoveParticipant: (participantId: number) => void
}

function MatchOrganization({
  participants,
  availableParticipants,
  onAddParticipant,
  onRemoveParticipant,
}: MatchOrganizationProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null)

  return (
    <div className="row g-4">
      {/* Ordem de Chegada */}
      <div className="col-lg-8">
        <h5 className="text-warning fw-bold mb-3">📋 Ordem de Chegada</h5>
        {participants.length === 0 ? (
          <div className="card bg-dark border-warning text-center py-4">
            <p className="text-light mb-0">Nenhum participante adicionado ainda</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {participants.map((p, idx) => (
              <div key={p.id} className="list-group-item bg-dark border-warning d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-warning text-dark fw-bold me-2">{idx + 1}</span>
                  <strong className="text-light">{p.name}</strong>
                  <small className="text-muted d-block">
                    {p.position}
                  </small>
                </div>
                <div className="btn-group" role="group">
                  {idx > 0 && (
                    <button className="btn btn-sm btn-outline-warning" title="Mover para cima">
                      ⬆️
                    </button>
                  )}
                  {idx < participants.length - 1 && (
                    <button className="btn btn-sm btn-outline-warning" title="Mover para baixo">
                      ⬇️
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onRemoveParticipant(p.participant_id)}
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adicionar Participante */}
      <div className="col-lg-4">
        <h5 className="text-warning fw-bold mb-3">➕ Adicionar Participante</h5>
        <div className="card bg-dark border-warning">
          <div className="card-body">
            {availableParticipants.length === 0 ? (
              <p className="text-light small mb-0">Todos os participantes já foram adicionados</p>
            ) : (
              <>
                <select
                  className="form-select form-select-sm bg-dark border-warning text-light mb-3"
                  value={selectedParticipant || ''}
                  onChange={(e) => setSelectedParticipant(parseInt(e.target.value))}
                >
                  <option value="">Selecionar participante...</option>
                  {availableParticipants.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position})
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-warning w-100 fw-bold"
                  onClick={() => {
                    if (selectedParticipant) {
                      onAddParticipant(selectedParticipant)
                      setSelectedParticipant(null)
                    }
                  }}
                  disabled={!selectedParticipant}
                >
                  ➕ Adicionar
                </button>
              </>
            )}
          </div>
        </div>

        <h5 className="text-warning fw-bold mt-4 mb-3">📊 Resumo</h5>
        <div className="card bg-dark border-warning">
          <div className="card-body text-center">
            <p className="text-light small mb-2">Total de Participantes</p>
            <h3 className="text-warning mb-3">{participants.length}</h3>
            <hr className="border-warning" />
            <p className="text-light small mb-2">Jogadores</p>
            <p className="text-light">
              {participants.filter(p => p.position === 'Jogador').length}
            </p>
            <p className="text-light small mb-2">Goleiros</p>
            <p className="text-light">
              {participants.filter(p => p.position === 'Goleiro').length}
            </p>
            <p className="text-light small mb-0">Juízes</p>
            <p className="text-light mb-0">
              {participants.filter(p => p.position === 'Juiz').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchOrganization
