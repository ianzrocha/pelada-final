import React from 'react'
import StarRating from './StarRating'

export default function ParticipantCard({p}){
  const initials = (p.name || '').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
  return (
    <div className="participant-card card mb-3">
      <div style={{display:'flex', gap:16, alignItems:'center', width:'100%'}}>
        <div className="participant-avatar">{initials}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <div>
              <div className="text-warning" style={{fontWeight:700}}>{p.name}</div>
              <div className="muted small">{p.fantasyName || ''}</div>
              <div className="muted small">Nasc.: {p.birthDate || '-'}</div>
              <div className="muted small">Tipo: {p.type || '-'} • {p.position || '-'} • {p.active ? 'Ativo' : 'Inativo'}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="small muted">Ofensivo</div>
              <StarRating value={p.offense || 0} readonly />
              <div className="small muted">Defensivo</div>
              <StarRating value={p.defense || 0} readonly />
              <div className="small muted">Velocidade</div>
              <StarRating value={p.speed || 0} readonly />
            </div>
          </div>

          <hr style={{borderColor:'rgba(255,255,255,0.04)', margin:'0.75rem 0'}}/>

          <div style={{display:'flex', gap:12, flexWrap:'wrap'}} className="muted small">
            <div>Gols: {p.goals || 0}</div>
            <div>G. Contra: {p.ownGoals || 0}</div>
            <div>Partidas: {p.matches || 0}</div>
            <div>Faltas: {p.fouls || 0}</div>
            <div>Cartões: {p.cards || 0}</div>
            <div>Pagamento: {p.paymentPaid ? 'Pago' : 'Pendente'}</div>
            <div>Tipo: {p.paymentType || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
