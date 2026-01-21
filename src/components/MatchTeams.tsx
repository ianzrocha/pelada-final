import { useState, useEffect } from 'react'
import type { MatchParticipant } from '../types'
import * as api from '../services/api'
import StarRating from './StarRating'

interface MatchTeamsProps {
  matchId: number
}

function MatchTeams({ matchId }: MatchTeamsProps) {
  const [participants, setParticipants] = useState<MatchParticipant[]>([])
  const [teams, setTeams] = useState<{ team1: MatchParticipant[]; team2: MatchParticipant[] }>({
    team1: [],
    team2: [],
  })
  const [teamStats, setTeamStats] = useState<{
    team1: { offensive: number; defensive: number; speed: number }
    team2: { offensive: number; defensive: number; speed: number }
  }>({
    team1: { offensive: 0, defensive: 0, speed: 0 },
    team2: { offensive: 0, defensive: 0, speed: 0 },
  })

  useEffect(() => {
    loadData()
  }, [matchId])

  const loadData = async () => {
    const data = await api.getMatchParticipants(matchId)
    // Filtrar apenas jogadores (não goleiros nem juízes)
    const players = data.filter(p => p.position === 'Jogador')
    setParticipants(players)
  }

  const calculateTeamStats = (teamPlayers: MatchParticipant[]) => {
    if (teamPlayers.length === 0) return { offensive: 0, defensive: 0, speed: 0 }

    const avgOffensive = teamPlayers.reduce((sum, p) => sum + p.offensive_rating, 0) / teamPlayers.length
    const avgDefensive = teamPlayers.reduce((sum, p) => sum + p.defensive_rating, 0) / teamPlayers.length
    const avgSpeed = teamPlayers.reduce((sum, p) => sum + p.speed_rating, 0) / teamPlayers.length

    return {
      offensive: Math.round(avgOffensive * 10) / 10,
      defensive: Math.round(avgDefensive * 10) / 10,
      speed: Math.round(avgSpeed * 10) / 10,
    }
  }

  const handleAutoMix = () => {
    if (participants.length === 0) {
      alert('Nenhum jogador disponível')
      return
    }

    // Embaralhar participantes
    const shuffled = [...participants].sort(() => Math.random() - 0.5)

    // Dividir em times (máx 6 por time)
    const maxPerTeam = 6
    const mid = Math.ceil(shuffled.length / 2)
    const team1 = shuffled.slice(0, Math.min(mid, maxPerTeam))
    const team2 = shuffled.slice(mid, Math.min(mid + maxPerTeam, shuffled.length))

    setTeams({ team1, team2 })

    // Calcular estatísticas
    const stats1 = calculateTeamStats(team1)
    const stats2 = calculateTeamStats(team2)
    setTeamStats({ team1: stats1, team2: stats2 })
  }

  const handleClear = () => {
    setTeams({ team1: [], team2: [] })
    setTeamStats({
      team1: { offensive: 0, defensive: 0, speed: 0 },
      team2: { offensive: 0, defensive: 0, speed: 0 },
    })
  }

  const renderTeam = (team: MatchParticipant[], teamNum: 1 | 2, stats: any) => (
    <div className="col-md-6">
      <div className="card bg-dark border-warning h-100">
        <div className="card-header bg-dark border-warning">
          <h5 className="text-warning mb-0">
            {teamNum === 1 ? '👕 Time 1' : '👕 Time 2'}
          </h5>
        </div>
        <div className="card-body">
          {team.length > 0 ? (
            <>
              <div className="mb-3">
                <h6 className="text-warning mb-2">Média do Time</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-light">Ofensivo</small>
                  <StarRating rating={Math.round(stats.offensive)} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-light">Defensivo</small>
                  <StarRating rating={Math.round(stats.defensive)} />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-light">Velocidade</small>
                  <StarRating rating={Math.round(stats.speed)} />
                </div>
              </div>

              <hr className="border-warning" />

              <div>
                <h6 className="text-warning mb-2">Jogadores ({team.length}/6)</h6>
                <ul className="list-unstyled">
                  {team.map((p, idx) => (
                    <li key={p.id} className="text-light small mb-2">
                      <span className="badge bg-secondary me-2">{idx + 1}</span>
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-light text-center py-3">Clique em "Mix Automático" para criar times</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4">
      <h5 className="text-warning mb-4">👥 Montagem de Times</h5>

      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-warning fw-bold" onClick={handleAutoMix}>
          🔀 Mix Automático
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={handleClear}
          disabled={teams.team1.length === 0 && teams.team2.length === 0}
        >
          ✕ Limpar
        </button>
      </div>

      {teams.team1.length > 0 || teams.team2.length > 0 ? (
        <div className="row g-3">
          {renderTeam(teams.team1, 1, teamStats.team1)}
          {renderTeam(teams.team2, 2, teamStats.team2)}
        </div>
      ) : (
        <div className="card bg-dark border-warning text-center py-5">
          <p className="text-light mb-0">Nenhum time criado. Clique em "Mix Automático" para começar!</p>
        </div>
      )}

      {participants.length === 0 && (
        <div className="alert alert-warning mt-3" role="alert">
          ⚠️ Adicione participantes na aba "Organização" antes de criar times
        </div>
      )}
    </div>
  )
}

export default MatchTeams
