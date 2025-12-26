import React, {useEffect, useState} from 'react'
import {getParticipants, getMatches} from '../services/storage'

export default function Home({onNavigate}){
  const [participantsCount, setParticipantsCount] = useState(0)
  const [matchesCount, setMatchesCount] = useState(0)
  const [nextMatch, setNextMatch] = useState(null)
  const [recentResultsCount, setRecentResultsCount] = useState(0)

  useEffect(()=>{
    (async()=>{
      const parts = await getParticipants() || []
      setParticipantsCount(parts.length)
      const matches = await getMatches() || []
      setMatchesCount(matches.length)

      // next upcoming match (closest date >= today)
      const now = new Date()
      const upcoming = matches.map(m=> ({...m, dateObj: m.date ? new Date(m.date) : null})).filter(m=>m.dateObj && m.dateObj >= now).sort((a,b)=> a.dateObj - b.dateObj)[0]
      setNextMatch(upcoming || (matches[0] || null))

      // count total recorded results across matches
      const totalResults = matches.reduce((acc,m)=> acc + ((m.results && m.results.length) || 0), 0)
      setRecentResultsCount(totalResults)
    })()
  }, [])

  return (
    <div>
      <div className="hero mb-4">
        <h1 className="text-brand">Rhema Society BETA</h1>
        <p className="muted">Organize participantes, partidas e a operação de peladas.</p>
      </div>

      <div className="d-flex flex-wrap" style={{gap:16}}>
        <div style={{flex:'1 1 320px'}}>
          <div className="card p-3 card-bordered" style={{height:'100%'}}>
            <h6 className="muted">Participantes</h6>
            <div className="d-flex align-items-baseline justify-content-between">
              <div>
                <div className="h2 text-brand">{participantsCount}</div>
                <div className="small muted">Cadastrados</div>
              </div>
              <div>
                <button className="btn btn-sm btn-ghost" onClick={()=>onNavigate('participants')}>Gerenciar</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{flex:'1 1 320px'}}>
          <div className="card p-3 card-bordered" style={{height:'100%'}}>
            <h6 className="muted">Partidas</h6>
            <div className="d-flex align-items-baseline justify-content-between">
              <div>
                <div className="h2 text-brand">{matchesCount}</div>
                <div className="small muted">Criadas</div>
              </div>
              <div>
                <button className="btn btn-sm btn-ghost" onClick={()=>onNavigate('matches')}>Ver Partidas</button>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      <div className="d-flex flex-wrap mt-4" style={{gap:16}}>
        <div style={{flex:'1 1 48%'}}>
          <div className="card p-3 card-bordered">
            <h6 className="muted">Próxima partida</h6>
            {nextMatch ? (
              <div>
                <div className="h5 text-brand">{nextMatch.title}</div>
                <div className="small muted">{nextMatch.date || 'Data não definida'}</div>
                <div className="mt-2"><button className="btn btn-sm btn-primary" onClick={()=>onNavigate('matches')}>Abrir</button></div>
              </div>
            ) : (
              <div className="muted">Nenhuma partida agendada.</div>
            )}
          </div>
        </div>

        <div style={{flex:'1 1 48%'}}>
          <div className="card p-3 card-bordered">
            <h6 className="muted">Atalhos</h6>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-ghost" onClick={()=>onNavigate('participants')}>Adicionar Participante</button>
              <button className="btn btn-ghost" onClick={()=>onNavigate({name:'matches', openCreate:true})}>Criar Partida</button>
            </div>
            <div className="mt-3">
              {/* chart removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
