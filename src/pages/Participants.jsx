import React, {useEffect, useState} from 'react'
import {getParticipants, addParticipant} from '../services/storage'
import ParticipantCard from '../components/ParticipantCard'
import StarRating from '../components/StarRating'

export default function Participants(){
  const [list, setList] = useState([])
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({name:'', fantasyName:'', birthDate:'', type:'mensalista', position:'jogador', active:true, offense:3, defense:3, speed:3, paymentType:'mensal', paymentPaid:false})

  useEffect(()=>{
    (async()=>{
      const p = await getParticipants() || []
      setList(p)
    })()
  }, [])

  function handleChange(k, v){
    setForm(s=>({...s, [k]: v}))
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(!form.name) return alert('Nome é obrigatório')
    await addParticipant(form)
    const p = await getParticipants()
    setList(p)
    setForm({name:'', fantasyName:'', birthDate:'', type:'mensalista', position:'jogador', active:true, offense:3, defense:3, speed:3, paymentType:'mensal', paymentPaid:false})
    setShowForm(false)
  }

  return (
    <div style={{maxWidth: '1400px', margin: '0 auto'}}>
      {/* Header Section */}
      <div style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #222'}}>
        <div className="mb-4">
          <div>
            <h1 className="text-warning mb-1" style={{fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.5px'}}>Participantes</h1>
            <p className="text-muted" style={{fontSize: '0.95rem', marginBottom: 0}}>Gerencie jogadores e equipes</p>
          </div>
        </div>
        
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div style={{flex: '1', minWidth: '280px', position: 'relative'}}>
            <input 
              placeholder="Pesquisar por nome..." 
              className="form-control" 
              value={query} 
              onChange={(e)=>setQuery(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(246, 200, 76, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>
          <button 
            className="btn btn-outline-light" 
            onClick={async()=>{const p = await getParticipants(); setList(p)}}
            style={{
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.9rem',
              border: '1px solid #555'
            }}
          >
            <i class="bi bi-arrow-repeat"></i> Atualizar 
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div style={{marginBottom: '2rem', animation: 'slideIn 0.3s ease'}}>
          <form 
            onSubmit={handleSubmit} 
            style={{
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.6) 0%, rgba(26, 26, 26, 0.8) 100%)',
              border: '1px solid rgba(246, 200, 76, 0.12)',
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 className="text-warning mb-4" style={{fontSize: '1.3rem', fontWeight: '600'}}>Adicionar Novo Participante</h3>
            
            <div className="row g-4">
              {/* Basic Info */}
              <div className="col-12 col-md-6">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Nome Completo *</label>
                <input 
                  className="form-control" 
                  value={form.name} 
                  onChange={(e)=>handleChange('name', e.target.value)}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Apelido</label>
                <input 
                  className="form-control" 
                  value={form.fantasyName} 
                  onChange={(e)=>handleChange('fantasyName', e.target.value)}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Ex: João Rapado"
                />
              </div>

              {/* Date, Type, Position */}
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Data de Nascimento</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={form.birthDate} 
                  onChange={(e)=>handleChange('birthDate', e.target.value)}
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
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Tipo</label>
                <select 
                  className="form-select" 
                  value={form.type} 
                  onChange={(e)=>handleChange('type', e.target.value)}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="mensalista">Mensalista</option>
                  <option value="diarista">Diarista</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Posição</label>
                <select 
                  className="form-select" 
                  value={form.position} 
                  onChange={(e)=>handleChange('position', e.target.value)}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="jogador">Jogador</option>
                  <option value="goleiro">Goleiro</option>
                  <option value="juiz">Juiz</option>
                </select>
              </div>
              <div className="col-12 col-lg-3">
                <label className="form-label" style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem'}}>Tipo Pagamento</label>
                <select 
                  className="form-select" 
                  value={form.paymentType} 
                  onChange={(e)=>handleChange('paymentType', e.target.value)}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              {/* Ratings */}
              <div className="col-12">
                <label style={{color: '#ffc107', fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '1rem'}}>⭐ Avaliações</label>
                <div className="row g-4">
                  <div className="col-12 col-md-4">
                    <label className="form-label text-muted small">Ofensivo</label>
                    <StarRating value={form.offense} onChange={(v)=>handleChange('offense', v)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label text-muted small">Defensivo</label>
                    <StarRating value={form.defense} onChange={(v)=>handleChange('defense', v)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label text-muted small">Velocidade</label>
                    <StarRating value={form.speed} onChange={(v)=>handleChange('speed', v)} />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-12">
                <div className="d-flex gap-4">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="activeSwitch" 
                      checked={form.active} 
                      onChange={(e)=>handleChange('active', e.target.checked)}
                      style={{width: '2.5rem', height: '1.25rem', cursor: 'pointer'}}
                    />
                    <label className="form-check-label" htmlFor="activeSwitch" style={{cursor: 'pointer'}}>
                      Ativo
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="paidSwitch"
                      checked={form.paymentPaid} 
                      onChange={(e)=>handleChange('paymentPaid', e.target.checked)}
                      style={{width: '2.5rem', height: '1.25rem', cursor: 'pointer'}}
                    />
                    <label className="form-check-label" htmlFor="paidSwitch" style={{cursor: 'pointer'}}>
                      Pagamento realizado
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
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
                  ✓ Salvar Participante
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

      {/* Empty State */}
      {list.length === 0 && !showForm && (
        <div 
          style={{
            textAlign: 'center',
            padding: '3rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.6) 0%, rgba(26, 26, 26, 0.8) 100%)',
            border: '1px solid rgba(246, 200, 76, 0.12)'
          }}
        >
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}><i class="bi bi-person-add"></i></div>
          <p className="text-muted mb-3">Nenhum participante cadastrado</p>
          <button 
            className="btn btn-warning" 
            onClick={()=>setShowForm(true)}
            style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              padding: '0.75rem 2rem',
              borderRadius: '8px'
            }}
          >
            + Adicionar Primeiro Participante
          </button>
        </div>
      )}

      {/* Participants Grid */}
      {list.length > 0 && (
        <div style={{marginTop: '2rem'}}>
          <div className="row g-4">
            {list.filter(p=> p.name && p.name.toLowerCase().includes(query.toLowerCase())).map(p=> (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
            <ParticipantCard p={p} />
          </div>
          ))}
          </div>
        </div>
      )}

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
