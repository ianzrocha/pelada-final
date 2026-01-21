import { useState, useEffect } from 'react'
import type { Match, MatchParticipant } from '../../types'
import StarRating from '../StarRating'

interface MatchTeamsProps {
  match: Match
  participants: MatchParticipant[]
}

interface Team {
  id: number
  players: MatchParticipant[]
  averageRating: number
}

function MatchTeams({ participants }: MatchTeamsProps) {
  const [teams, setTeams] = useState<[Team, Team]>([
    { id: 1, players: [], averageRating: 0 },
    { id: 2, players: [], averageRating: 0 },
  ])

  useEffect(() => {
    generateTeams()
  }, [participants])

  const generateTeams = () => {
    if (participants.length === 0) {
      setTeams([
        { id: 1, players: [], averageRating: 0 },
        { id: 2, players: [], averageRating: 0 },
      ])
      return
    }

    // Filtrar jogadores (excluindo goleiros e juízes para o cálculo)
    const players = participants.filter(p => p.position === 'Jogador')
    const goalkeepers = participants.filter(p => p.position === 'Goleiro')
    const referees = participants.filter(p => p.position === 'Juiz')

    // Distribuir jogadores de forma balanceada
    const sortedPlayers = [...players].sort((a, b) => {
      const ratingA = (a.offensive_rating + a.defensive_rating + a.speed_rating) / 3
      const ratingB = (b.offensive_rating + b.defensive_rating + b.speed_rating) / 3
      return ratingB - ratingA
    })

    const team1Players: MatchParticipant[] = []
    const team2Players: MatchParticipant[] = []

    // Distribuição alternada para balancear
    sortedPlayers.forEach((player, idx) => {
      if (idx % 2 === 0) {
        team1Players.push(player)
      } else {
        team2Players.push(player)
      }
    })

    // Adicionar um goleiro em cada time se houver
    if (goalkeepers.length > 0) {
      team1Players.push(goalkeepers[0])
    }
    if (goalkeepers.length > 1) {
      team2Players.push(goalkeepers[1])
    } else if (goalkeepers.length === 1 && team2Players.filter(p => p.position === 'Goleiro').length === 0) {
      team2Players.push(goalkeepers[0])
    }

    // Adicionar um juiz se houver
    if (referees.length > 0) {
      team1Players.push(referees[0])
    }

    // Calcular médias
    const calcAverage = (teamPlayers: MatchParticipant[]) => {
      if (teamPlayers.length === 0) return 0
      const sum = teamPlayers.reduce((acc, p) => acc + ((p.offensive_rating + p.defensive_rating + p.speed_rating) / 3), 0)
      return Math.round((sum / teamPlayers.length) * 10) / 10
    }

    setTeams([
      { id: 1, players: team1Players, averageRating: calcAverage(team1Players) },
      { id: 2, players: team2Players, averageRating: calcAverage(team2Players) },
    ])
  }

  const getStarCount = (rating: number) => {
    return Math.round(rating)
  }

  return (
    <div>
      <div className="row g-4">
        {teams.map((team) => (
          <div key={team.id} className="col-lg-6">
            <div className="card bg-dark border-warning h-100">
              <div className="card-header bg-dark border-warning">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-warning fw-bold mb-0">⚽ Time {team.id}</h5>
                  <div className="text-center">
                    <small className="text-light d-block">Força Geral</small>
                    <div className="d-flex gap-1 justify-content-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < getStarCount(team.averageRating) ? 'text-warning' : 'text-muted'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {team.players.length === 0 ? (
                  <p className="text-light text-center mb-0">Sem jogadores</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {team.players.map((player) => (
                      <div key={player.id} className="list-group-item bg-dark border-warning py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong className="text-light">{player.name}</strong>
                            <div className="small text-muted">
                              {player.position}
                              {player.position === 'Jogador' && (
                                <div className="d-flex gap-2 mt-1">
                                  <span>
                                    Ataque: <StarRating rating={player.offensive_rating} maxRating={5} />
                                  </span>
                                  <span>
                                    Defesa: <StarRating rating={player.defensive_rating} maxRating={5} />
                                  </span>
                                  <span>
                                    Velocidade: <StarRating rating={player.speed_rating} maxRating={5} />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 pt-3 border-top border-warning">
                  <p className="text-light small mb-1">Total de Jogadores: <strong>{team.players.length}</strong></p>
                  <p className="text-light small mb-0">
                    Jogadores: <strong>{team.players.filter(p => p.position === 'Jogador').length}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-4">
        <div className="col-12">
          <button className="btn btn-warning fw-bold w-100" onClick={generateTeams}>
            🔄 Refazer Times
          </button>
        </div>
      </div>
    </div>
  )
}

export default MatchTeams
