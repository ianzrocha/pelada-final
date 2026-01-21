import { useState, useEffect } from 'react'
import type { MatchParticipant } from '../types'
import * as api from '../services/api'

interface MatchOrganizationProps {
  matchId: number
}

function MatchOrganization({ matchId }: MatchOrganizationProps) {
  const [participants, setParticipants] = useState<MatchParticipant[]>([])
  const [allParticipants, setAllParticipants] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [matchId])

  const loadData = async () => {
    const [matchParts, allParts] = await Promise.all([
      api.getMatchParticipants(matchId),
      api.getParticipants(),
    ])
    setParticipants(matchParts)
    setAllParticipants(allParts)
  }

  const handleAddParticipant = async () => {
    if (selectedParticipant) {
      await api.addMatchParticipant(matchId, selectedParticipant, participants.length + 1)
      loadData()
      setSelectedParticipant(null)
      setShowAddForm(false)
    }
  }

  const handleRemove = async (id: number) => {
    if (confirm('Remover este participante?')) {
      await api.removeMatchParticipant(id)
      loadData()
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      const updated: MatchParticipant[] = [...participants]
      const temp = updated[index]
      updated[index] = updated[index - 1]
      updated[index - 1] = temp
      setParticipants(updated)
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index < participants.length - 1) {
      const updated: MatchParticipant[] = [...participants]
      const temp = updated[index]
      updated[index] = updated[index + 1]
      updated[index + 1] = temp
      setParticipants(updated)
    }
  }

  const availableParticipants = allParticipants.filter(
    p => !participants.some(mp => mp.participant_id === p.id)
  )

  return (
    <div className="p-4">
      <h5 className="text-warning mb-4">📋 Ordem de Chegada</h5>

      <button
        className="btn btn-sm btn-warning mb-3"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? '✕ Cancelar' : '➕ Adicionar Participante'}
      </button>

      {showAddForm && (
        <div className="card bg-dark border-warning mb-3 p-3">
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm bg-dark border-warning text-light"
              value={selectedParticipant || ''}
              onChange={(e) => setSelectedParticipant(Number(e.target.value))}
            >
              <option value="">Selecione um participante</option>
              {availableParticipants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              className="btn btn-sm btn-warning"
              onClick={handleAddParticipant}
              disabled={!selectedParticipant}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      <div className="list-group list-group-flush">
        {participants.map((p, idx) => (
          <div
            key={p.id}
            className="list-group-item list-group-item-action bg-dark border-warning d-flex align-items-center justify-content-between p-3"
          >
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '1.2rem' }}>
                  {idx + 1}º
                </span>
                <div>
                  <p className="text-light fw-bold mb-0">{p.name}</p>
                  <small className="text-muted">{p.position}</small>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => handleMoveUp(idx)}
                disabled={idx === 0}
                title="Mover para cima"
              >
                ⬆️
              </button>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => handleMoveDown(idx)}
                disabled={idx === participants.length - 1}
                title="Mover para baixo"
              >
                ⬇️
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemove(p.id)}
                title="Remover"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-4">
          <p className="text-light">Nenhum participante adicionado ainda</p>
        </div>
      )}
    </div>
  )
}

export default MatchOrganization
