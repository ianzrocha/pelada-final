import React, {useEffect, useState} from 'react'
import StarRating from './StarRating'
import {getParticipants} from '../services/storage'

function avgSkill(p){
  return ((p.offense||0) + (p.defense||0) + (p.speed||0)) / 3
}

function skillToStars(val){
  // val 0-5 => round
  return Math.round(val)
}

export default function MatchDetail({match, onSave}){
  const [org, setOrg] = useState(match.organization || [])
  const [allPlayers, setAllPlayers] = useState([])
  const [teams, setTeams] = useState({a:[], b:[], avgA:0, avgB:0})
  const [results, setResults] = useState(match.results || [])
  const [creating, setCreating] = useState(false)
  const [scorerCounts, setScorerCounts] = useState({})
  const [currentGameIndex, setCurrentGameIndex] = useState((match.results && match.results.length) || 0)

  useEffect(()=>{(async()=>{ setAllPlayers(await getParticipants()) })()}, [])

  useEffect(()=>{ setOrg(match.organization || []) }, [match])

  function moveUp(i){ if(i<=0) return; const copy=[...org]; [copy[i-1], copy[i]] = [copy[i], copy[i-1]]; setOrg(copy) }
  function moveDown(i){ if(i>=org.length-1) return; const copy=[...org]; [copy[i+1], copy[i]] = [copy[i], copy[i+1]]; setOrg(copy) }
  function removeAt(i){ const copy=[...org]; copy.splice(i,1); setOrg(copy) }

  function addPlayer(id){ if(!id) return; setOrg(s=>[...s, id]) }

  function buildTeams(){
    const roster = org.map(id=> allPlayers.find(p=>p.id===id)).filter(Boolean)
    // separate juiz (judge) out and goleiro count
    const judges = roster.filter(p=>p.position==='juiz')
    const keepers = roster.filter(p=>p.position==='goleiro')
    const others = roster.filter(p=>p.position!=='juiz' && p.position!=='goleiro')

    // compute skill
    const players = others.map(p=> ({...p, skill: avgSkill(p)}))

    // greedy balance by skill (descending)
    players.sort((a,b)=> b.skill - a.skill)
    const teamA = []
    const teamB = []
    const maxPerTeam = 6

    const avg = arr => arr.length ? (arr.reduce((s,x)=>s+avgSkill(x),0)/arr.length) : 0

    players.forEach(pl => {
      const aAvg = avg(teamA)
      const bAvg = avg(teamB)
      // choose the team with fewer players or lower avg, respect max
      if((teamA.length < teamB.length && teamA.length < maxPerTeam) || (teamA.length < maxPerTeam && aAvg <= bAvg)){
        teamA.push(pl)
      }else if(teamB.length < maxPerTeam){
        teamB.push(pl)
      }else if(teamA.length < maxPerTeam){
        teamA.push(pl)
      }else{
        // overflow: place in A
        teamA.push(pl)
      }
    })

    // assign goalkeepers by arrival order to teams if present, do not count them in balance
    if(keepers.length){
      if(keepers[0]) teamA.unshift(keepers[0])
      if(keepers[1]) teamB.unshift(keepers[1])
      // extra keepers appended to A
      for(let i=2;i<keepers.length;i++) teamA.push(keepers[i])
    }

    const avgA = avg(teamA)
    const avgB = avg(teamB)

    setTeams({a:teamA, b:teamB, avgA, avgB, judges})
  }

  function save(){
    const payload = {...match, organization: org, results}
    onSave(payload)
  }

  function startCreateResult(){
    setCreating(true)
    setScorerCounts({})
  }

  function incScorer(id){
    setScorerCounts(s=> ({...s, [id]: (s[id]||0)+1}))
  }
  function decScorer(id){
    setScorerCounts(s=> ({...s, [id]: Math.max(0, (s[id]||0)-1)}))
  }

  function addResult(){
    // compute scorers array and scores
    const scorers = Object.entries(scorerCounts).filter(([_,v])=>v>0).map(([playerId, goals])=>({playerId, goals}))
    // determine team membership
    const teamAIds = (teams.a || []).map(p=>p.id)
    const teamBIds = (teams.b || []).map(p=>p.id)
    let scoreA = 0, scoreB = 0
    scorers.forEach(s => {
      if(teamAIds.includes(s.playerId)) scoreA += s.goals
      else if(teamBIds.includes(s.playerId)) scoreB += s.goals
    })
    const newResult = {game: results.length+1, scoreA, scoreB, scorers}
    setResults(r=>[...r, newResult])
    setCreating(false)
    setScorerCounts({})
    setCurrentGameIndex(results.length+1)
  }

  return (
    <div className="row">
      <div className="col-12 col-md-5">
        <div className="card p-3 mb-3">
          <h5 className="text-warning">Organização</h5>
          <div className="mb-2">
            <select className="form-select" onChange={(e)=>addPlayer(e.target.value)}>
              <option value="">Adicionar jogador (ordem de chegada)</option>
              {allPlayers.map(p=> <option key={p.id} value={p.id}>{p.name} — {p.position}</option>)}
            </select>
          </div>

          <div>
            {org.map((id, i)=>{
              const p = allPlayers.find(x=>x.id===id) || {name:'(desconhecido)'}
              return (
                <div key={id} className="d-flex align-items-center justify-content-between border-bottom py-2">
                  <div>
                    <div className="text-warning">{p.name}</div>
                    <div className="small muted">{p.position}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-ghost" onClick={()=>moveUp(i)}>↑</button>
                    <button className="btn btn-sm btn-ghost" onClick={()=>moveDown(i)}>↓</button>
                    <button className="btn btn-sm btn-ghost text-warning" onClick={()=>removeAt(i)}>Remover</button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={buildTeams}>Montar Times</button>
            <button className="btn btn-ghost" onClick={save}>Salvar Organização</button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-7">
        <div className="card p-3 mb-3">
          <h5 className="text-warning">Times</h5>
          <div className="row">
            <div className="col-12 col-md-6">
              <h6 className="muted">Time A <span className="text-warning">{teams.avgA ? ' ' : ''}</span></h6>
              <div className="mb-2"><StarRating value={skillToStars(teams.avgA)} readonly /></div>
              <ul className="list-group list-group-flush">
                {teams.a && teams.a.map(p=> (<li key={p.id} className="list-group-item bg-transparent">{p.name} <span className="small text-muted">({p.position})</span></li>))}
              </ul>
            </div>
            <div className="col-12 col-md-6">
              <h6 className="text-muted">Time B</h6>
              <div className="mb-2"><StarRating value={skillToStars(teams.avgB)} readonly /></div>
              <ul className="list-group list-group-flush">
                {teams.b && teams.b.map(p=> (<li key={p.id} className="list-group-item bg-transparent">{p.name} <span className="small text-muted">({p.position})</span></li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-3">
          <h5 className="text-warning">Partida</h5>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="muted">Jogos: {match.games || 1}</div>
              <div>
                <button className="btn btn-sm btn-ghost me-2" onClick={startCreateResult}>Adicionar Resultado</button>
                <button className="btn btn-sm btn-primary" onClick={save}>Salvar Partida</button>
              </div>
            </div>
          </div>

          {creating && (
            <div className="mb-3">
              <div className="mb-2 muted">Clique nos jogadores para marcar gols para o jogo #{results.length+1}</div>
              <div className="row">
                <div className="col-6">
                  <div className="small text-muted">Time A</div>
                  <ul className="list-group list-group-flush">
                    {(teams.a||[]).map(p=> (
                      <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                        <div>{p.name}</div>
                        <div className="d-flex gap-2 align-items-center">
                          <button className="btn btn-sm btn-ghost" onClick={()=>decScorer(p.id)}>-</button>
                          <div className="px-2">{scorerCounts[p.id]||0}</div>
                          <button className="btn btn-sm btn-ghost" onClick={()=>incScorer(p.id)}>+</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <div className="small muted">Time B</div>
                  <ul className="list-group list-group-flush">
                    {(teams.b||[]).map(p=> (
                      <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
                        <div>{p.name}</div>
                        <div className="d-flex gap-2 align-items-center">
                          <button className="btn btn-sm btn-ghost" onClick={()=>decScorer(p.id)}>-</button>
                          <div className="px-2">{scorerCounts[p.id]||0}</div>
                          <button className="btn btn-sm btn-ghost" onClick={()=>incScorer(p.id)}>+</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-2">
                <button className="btn btn-sm btn-primary me-2" onClick={addResult}>Confirmar Resultado</button>
                <button className="btn btn-sm btn-ghost" onClick={()=>{setCreating(false); setScorerCounts({})}}>Cancelar</button>
              </div>
            </div>
          )}

          <div>
            <h6 className="muted">Histórico de resultados</h6>
            <ul className="list-group list-group-flush">
              {results.map((r,i)=> (
                <li key={i} className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                  <div>Jogo #{r.game}: <strong className="text-warning">{r.scoreA}</strong> x <strong className="text-warning">{r.scoreB}</strong></div>
                  <div className="small text-muted">Scorers: { (r.scorers||[]).map(s=> {
                    const p = allPlayers.find(x=>x.id===s.playerId)
                    return p ? `${p.name}(${s.goals})` : `(${s.playerId}:${s.goals})`
                  }).join(', ')}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
