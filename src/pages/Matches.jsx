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
    <div style={{maxWidth: '1400px', margin: '0 auto'}}>
      {/* Header Section */}
      <div style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #222'}}>
        <div className="mb-4">
          <h1 className="text-warning mb-1" style={{fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.5px'}}>Partidas</h1>
          <p className="text-muted" style={{fontSize: '0.95rem', marginBottom: 0}}>Organize e gerencie seus jogos</p>
        </div>
        <button 
          className="btn btn-warning" 
          onClick={()=>setShowForm(s=>!s)}
          style={{
            fontSize: '0.95rem',
            fontWeight: '600',
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          {showForm ? '✕ Fechar' : '+ Nova Partida'}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div style={{marginBottom: '2rem', animation: 'slideIn 0.3s ease'}}>
          <form 
            className="card" 
            onSubmit={handleCreate}
            style={{
              background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 className="text-warning mb-4" style={{fontSize: '1.3rem', fontWeight: '600'}}>Criar Nova Partida</h3>
            
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Título *</label>
                <input 
                  className="form-control" 
                  value={form.title} 
                  onChange={e=>setForm(s=>({...s, title:e.target.value}))}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Data</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={form.date} 
                  onChange={e=>setForm(s=>({...s, date:e.target.value}))}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div className="col-12">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Descrição</label>
                <input 
                  className="form-control" 
                  value={form.description} 
                  onChange={e=>setForm(s=>({...s, description:e.target.value}))}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Quantidade de Jogos</label>
                <input 
                  type="number" 
                  min={1} 
                  className="form-control" 
                  value={form.games} 
                  onChange={e=>setForm(s=>({...s, games: Number(e.target.value)}))}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="col-12 d-flex gap-2 pt-3">
                <button 
                  className="btn btn-warning" 
                  type="submit"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✓ Criar Partida
                </button>
                <button 
                  className="btn btn-outline-light" 
                  type="button" 
                  onClick={()=>setShowForm(false)}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #555',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✕ Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Content Section */}
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div style={{display: 'grid', gap: '1rem'}}>
            {list.length === 0 ? (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                  border: '1px solid #333'
                }}
              >
                <p className="text-muted">Nenhuma partida criada</p>
              </div>
            ) : (
              list.map(m=> <MatchCard key={m.id} m={m} onOpen={openMatch} />)
            )}
          </div>
        </div>

        <div className="col-12 col-lg-7">
          {current ? (
            <MatchDetail match={current} onSave={saveMatch} />
          ) : (
            <div 
              style={{
                padding: '3rem',
                textAlign: 'center',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                border: '1px solid #333'
              }}
            >
              <p className="text-muted">Selecione uma partida para ver/editar</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
