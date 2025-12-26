import React from 'react'

export default function MatchCard({m, onOpen}){
  return (
    <div className="match-card card mb-3">
      <div className="d-flex justify-content-between align-items-center" style={{width:'100%'}}>
        <div>
          <div className="text-warning" style={{fontWeight:700}}>{m.title}</div>
          <div className="muted small">{m.date} • {m.games} jogo(s)</div>
        </div>
        <div>
          <button className="btn btn-sm btn-primary me-2" onClick={()=>onOpen(m.id)}>Abrir</button>
        </div>
      </div>
    </div>
  )
}
