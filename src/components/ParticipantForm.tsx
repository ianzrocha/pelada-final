import { useState } from 'react'
import type { Participant } from '../types'

interface ParticipantFormProps {
  onSubmit: (participant: Participant) => void
  onCancel: () => void
  initialData?: Participant
}

function ParticipantForm({ onSubmit, onCancel, initialData }: ParticipantFormProps) {
  const [formData, setFormData] = useState<Participant>(
    initialData || {
      name: '',
      fantasy_name: '',
      birth_date: '',
      type: 'Diarista',
      position: 'Jogador',
      active: true,
      offensive_rating: 3,
      defensive_rating: 3,
      speed_rating: 3,
      fouls: 0,
      cards: 0,
      goals: 0,
      own_goals: 0,
      matches_played: 0,
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleStarChange = (field: string, value: number) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Por favor, preencha o nome do participante')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-dark border-primary p-4">
      <h4 className="text-primary mb-4">
        {initialData ? '✏️ Editar Participante' : '➕ Adicionar Novo Participante'}
      </h4>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-primary fw-bold">Nome Completo *</label>
          <input
            type="text"
            className="form-control bg-dark border-primary text-light"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite o nome completo"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label text-primary fw-bold">Nome Fantasia</label>
          <input
            type="text"
            className="form-control bg-dark border-primary text-light"
            name="fantasy_name"
            value={formData.fantasy_name || ''}
            onChange={handleChange}
            placeholder="Apelido ou nome de quadra"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label text-primary fw-bold">Data de Nascimento</label>
          <input
            type="date"
            className="form-control bg-dark border-primary text-light"
            name="birth_date"
            value={formData.birth_date || ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label text-primary fw-bold">Tipo</label>
          <select
            className="form-select bg-dark border-primary text-light"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Diarista">Diarista</option>
            <option value="Mensalista">Mensalista</option>
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label text-primary fw-bold">Posição</label>
          <select
            className="form-select bg-dark border-primary text-light"
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option value="Jogador">Jogador</option>
            <option value="Goleiro">Goleiro</option>
            <option value="Juiz">Juiz</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label text-primary fw-bold">Status</label>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="active"
            id="activeCheck"
            checked={formData.active}
            onChange={handleChange}
          />
          <label className="form-check-label text-light" htmlFor="activeCheck">
            Ativo
          </label>
        </div>
      </div>

      <h5 className="text-primary mt-4 mb-3">⭐ Avaliações</h5>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label text-primary fw-bold">Ofensivo</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={`offensive-${star}`}
                type="button"
                className={`btn btn-sm ${formData.offensive_rating >= star ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleStarChange('offensive_rating', star)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label text-primary fw-bold">Defensivo</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={`defensive-${star}`}
                type="button"
                className={`btn btn-sm ${formData.defensive_rating >= star ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleStarChange('defensive_rating', star)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label text-primary fw-bold">Velocidade</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={`speed-${star}`}
                type="button"
                className={`btn btn-sm ${formData.speed_rating >= star ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleStarChange('speed_rating', star)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
        <button type="button" className="btn btn-outline-light" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary fw-bold">
          {initialData ? '💾 Atualizar' : '➕ Adicionar'}
        </button>
      </div>
    </form>
  )
}

export default ParticipantForm
