import React, {useEffect, useState} from 'react'
import {getMatches, addMatch, updateMatch, getParticipants} from '../services/storage'
import MatchCard from '../components/MatchCard'
import MatchDetail from '../components/MatchDetail'

export default function Matches({openCreate=false}){
  const [list, setList] = useState([])
  const [showForm, setShowForm] = useState(openCreate)
  const [current, setCurrent] = useState(null)
  const [form, setForm] = useState({title:'Rhema Society', description:'', date:'', games:1, organization:[]})

  useEffect(()=>{(async()=>{ setList(await getMatches()) })()}, [])

  async function handleCreate(e){
    e.preventDefault()
    const id = await addMatch(form)
    setList(await getMatches())
    setShowForm(false)
    setForm({title:'Rhema Society', description:'', date:'', games:1, organization:[]})
  }

  async function openMatch(id){
    const m = (await getMatches()).find(x=>x.id===id)
    setCurrent(m)
  }

  async function saveMatch(m){
    await updateMatch(m.id, m)
    setList(await getMatches())
    setCurrent(m)
  }

  useEffect(()=>{ if(openCreate) setShowForm(true) }, [openCreate])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-warning">Partidas</h3>
        <div>
          <button className="btn btn-outline-light me-2" onClick={()=>setShowForm(s=>!s)}>{showForm ? 'Fechar' : 'Criar Partida'}</button>
        </div>
      </div>

      {showForm && (
        <form className="card p-3 mb-3" onSubmit={handleCreate} style={{background:'#0f0f0f'}}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Título</label>
              <input className="form-control" value={form.title} onChange={e=>setForm(s=>({...s, title:e.target.value}))} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Data</label>
              <input type="date" className="form-control" value={form.date} onChange={e=>setForm(s=>({...s, date:e.target.value}))} />
            </div>
            <div className="col-12">
              <label className="form-label">Descrição</label>
              <input className="form-control" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Quantidade de jogos</label>
              <input type="number" min={1} className="form-control" value={form.games} onChange={e=>setForm(s=>({...s, games: Number(e.target.value)}))} />
            </div>
            <div className="col-12 mt-2">
              <button className="btn btn-warning" type="submit">Criar</button>
            </div>
          </div>
        </form>
      )}

      <div className="row">
        <div className="col-12 col-md-5">
          <div>
            {list.map(m=> <MatchCard key={m.id} m={m} onOpen={openMatch} />)}
          </div>
        </div>

        <div className="col-12 col-md-7">
          {current ? (
            <MatchDetail match={current} onSave={saveMatch} />
          ) : (
            <div className="p-4 text-muted">Selecione uma partida para ver/editar organização, times e partida.</div>
          )}
        </div>
      </div>
    </div>
  )
}
