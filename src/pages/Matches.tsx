import { useState, useEffect } from 'react'
import type { Match } from '../types'
import * as api from '../services/api'
import MatchCard from '../components/MatchCard'
import MatchForm from '../components/MatchForm'
import MatchDetail from '../components/MatchDetail'

function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    const data = await api.getMatches()
    setMatches(data)
    setLoading(false)
  }

  const handleAddMatch = async (match: Match) => {
    const result = await api.addMatch(match)
    if (result) {
      setMatches([result, ...matches])
      setShowForm(false)
    }
  }

  const handleRemoveMatch = async (id: number) => {
    if (confirm('Tem certeza que deseja remover esta partida?')) {
      const success = await api.removeMatch(id)
      if (success) {
        setMatches(matches.filter(m => m.id !== id))
      }
    }
  }

  return (
    <div className="container py-5">
      <div className="row mb-4 page-hero">
        <div className="col-lg-8">
          <h1 className="text-primary mb-3">⚽ Partidas</h1>
          <p className="text-muted">Gerencie suas partidas e acompanhe resultados</p>
        </div>
        <div className="col-lg-4 text-end">
          <button
            className="btn btn-primary fw-bold"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancelar' : '➕ Nova Partida'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <MatchForm onSubmit={handleAddMatch} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card bg-dark border-primary text-center py-5">
              <h4 className="text-light">Nenhuma partida encontrada</h4>
              <p className="text-light mb-3">Clique em "Nova Partida" para começar</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="modern-grid">
          {matches.map(m => (
            <div key={m.id}>
              <MatchCard
                match={m}
                onRemove={handleRemoveMatch}
              />
            </div>
          ))}
        </div>
      )}

      <button className="fab-add" title="Nova Partida" onClick={() => setShowForm(true)}>+</button>

      {selectedMatch && (
        <MatchDetail
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  )
}

export default Matches
