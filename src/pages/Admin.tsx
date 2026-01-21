import { useState, useEffect } from 'react'
import type { Participant } from '../types'
import * as api from '../services/api'

function Admin() {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    loadParticipants()
  }, [])

  const loadParticipants = async () => {
    const data = await api.getParticipants()
    setParticipants(data)
  }

  const handleResetStats = async (id: number) => {
    if (confirm('Deseja resetar as estatísticas deste participante?')) {
      await api.updateParticipant(id, {
        fouls: 0,
        cards: 0,
        goals: 0,
        own_goals: 0,
        matches_played: 0
      })
      loadParticipants()
    }
  }

  const exportToCSV = () => {
    const csv = [
      ['Nome', 'Nome Fantasia', 'Tipo', 'Posição', 'Ofensivo', 'Defensivo', 'Velocidade', 'Faltas', 'Cartões', 'Gols', 'Contras', 'Partidas']
    ]

    participants.forEach(p => {
      csv.push([
        p.name,
        p.fantasy_name || '',
        p.type,
        p.position,
        p.offensive_rating,
        p.defensive_rating,
        p.speed_rating,
        p.fouls,
        p.cards,
        p.goals,
        p.own_goals,
        p.matches_played
      ].map(v => `"${v}"`))
    })

    const csvContent = csv.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'participantes.csv'
    a.click()
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-lg-10 mx-auto">
          <h1 className="text-warning mb-3">⚙️ Administração</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-10 mx-auto">
          <div className="card bg-dark border-warning">
            <div className="card-body">
              <h4 className="text-warning mb-3">📊 Resumo de Pagamentos</h4>
              <div className="row">
                <div className="col-md-4">
                  <div className="bg-secondary bg-opacity-25 p-3 rounded mb-3">
                    <p className="text-light small mb-0">Mensalistas</p>
                    <h5 className="text-warning">
                      {participants.filter(p => p.type === 'Mensalista' && p.active).length}
                    </h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-secondary bg-opacity-25 p-3 rounded mb-3">
                    <p className="text-light small mb-0">Diaristas</p>
                    <h5 className="text-warning">
                      {participants.filter(p => p.type === 'Diarista' && p.active).length}
                    </h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-secondary bg-opacity-25 p-3 rounded mb-3">
                    <p className="text-light small mb-0">Total Ativo</p>
                    <h5 className="text-warning">
                      {participants.filter(p => p.active).length}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card bg-dark border-warning">
            <div className="card-header bg-dark border-warning">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="text-warning mb-0">⚠️ Controle de Pagamentos</h4>
                </div>
                <div className="col-auto">
                  <button className="btn btn-sm btn-warning" onClick={exportToCSV}>
                    📥 Exportar CSV
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-dark mb-0">
                <thead>
                  <tr>
                    <th className="text-light">Nome</th>
                    <th className="text-light">Tipo</th>
                    <th className="text-light">Status</th>
                    <th className="text-light">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id}>
                      <td className="text-light">{p.name}</td>
                      <td className="text-light">{p.type}</td>
                      <td>
                        <span className={`badge ${p.active ? 'bg-success' : 'bg-danger'}`}>
                          {p.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleResetStats(p.id!)}
                        >
                          🔄 Resetar Stats
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
