import { useState } from 'react'
import type { Match } from '../types'

interface MatchFormProps {
  onSubmit: (match: Match) => void
  onCancel: () => void
  initialData?: Match
}

function MatchForm({ onSubmit, onCancel, initialData }: MatchFormProps) {
  const [formData, setFormData] = useState<Match>(
    initialData || {
      title: '',
      description: '',
      match_date: new Date().toISOString().split('T')[0],
      games_count: 1,
      status: 'pending',
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'games_count' ? parseInt(value) : value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Por favor, preencha o título da partida')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-dark border-warning p-4">
      <h4 className="text-warning mb-4">
        {initialData ? '✏️ Editar Partida' : '➕ Nova Partida'}
      </h4>

      <div className="mb-3">
        <label className="form-label text-warning fw-bold">Título *</label>
        <input
          type="text"
          className="form-control bg-dark border-warning text-light"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Rhema Society - 21/01/2026"
        />
      </div>

      <div className="mb-3">
        <label className="form-label text-warning fw-bold">Descrição</label>
        <textarea
          className="form-control bg-dark border-warning text-light"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Descreva detalhes da partida"
          rows={3}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-warning fw-bold">Data *</label>
          <input
            type="date"
            className="form-control bg-dark border-warning text-light"
            name="match_date"
            value={formData.match_date}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label text-warning fw-bold">Quantidade de Jogos</label>
          <input
            type="number"
            className="form-control bg-dark border-warning text-light"
            name="games_count"
            value={formData.games_count}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>
      </div>

      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" className="btn btn-outline-light" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-warning fw-bold">
          {initialData ? '💾 Atualizar' : '➕ Criar Partida'}
        </button>
      </div>
    </form>
  )
}

export default MatchForm
