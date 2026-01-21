import { useState, useEffect } from 'react'
import type { Participant } from '../types'
import * as api from '../services/api'
import ParticipantCard from '../components/ParticipantCard'
import ParticipantForm from '../components/ParticipantForm'

function Participants() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadParticipants()
  }, [])

  const loadParticipants = async () => {
    setLoading(true)
    const data = await api.getParticipants()
    setParticipants(data)
    setLoading(false)
  }

  const handleAddParticipant = async (participant: Participant) => {
    const result = await api.addParticipant(participant)
    if (result) {
      setParticipants([...participants, result])
      setShowForm(false)
      alert('✅ Participante adicionado com sucesso!')
      loadParticipants()
    } else {
      alert('❌ Erro ao adicionar participante. Tente novamente.')
    }
  }

  const handleUpdateParticipant = async (id: number, participant: Partial<Participant>) => {
    const result = await api.updateParticipant(id, participant)
    if (result) {
      setParticipants(participants.map(p => p.id === id ? result : p))
    }
  }

  const handleRemoveParticipant = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este participante?')) {
      const success = await api.removeParticipant(id)
      if (success) {
        setParticipants(participants.filter(p => p.id !== id))
      }
    }
  }

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.fantasy_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-lg-8">
          <h1 className="text-primary mb-3">👥 Participantes</h1>
        </div>
        <div className="col-lg-4 text-end">
          <button
            className="btn btn-primary fw-bold"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancelar' : '➕ Adicionar Participante'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <ParticipantForm onSubmit={handleAddParticipant} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-lg-8 mx-auto">
          <input
            type="text"
            className="form-control form-control-lg bg-dark border-primary text-light"
            placeholder="🔍 Buscar por nome ou nome fantasia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : filteredParticipants.length === 0 ? (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card bg-dark border-primary text-center py-5">
              <h4 className="text-light">Nenhum participante encontrado</h4>
              <p className="text-light mb-3">Clique em "Adicionar Participante" para começar</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="modern-grid">
          {filteredParticipants.map(p => (
            <div key={p.id}>
              <ParticipantCard
                participant={p}
                onUpdate={handleUpdateParticipant}
                onRemove={handleRemoveParticipant}
              />
            </div>
          ))}
        </div>
      )}

      {/* Floating add button for quick access */}
      <button className="fab-add" title="Adicionar" onClick={() => setShowForm(true)}>+</button>
    </div>
  )
}

export default Participants
