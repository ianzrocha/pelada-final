import React, {useEffect, useState} from 'react'
import {getParticipants, addParticipant} from '../services/storage'
import ParticipantCard from '../components/ParticipantCard'
import StarRating from '../components/StarRating'

export default function Participants(){
  const [list, setList] = useState([])
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({name:'', fantasyName:'', birthDate:'', type:'mensalista', position:'jogador', active:true, offense:3, defense:3, speed:3})

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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="text-warning" style={{padding: '10px'}}>Participantes</h3>
          <div className="small muted">Lista em ordem alfabética • Pesquise por nome</div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <input placeholder="Buscar participante..." className="form-control form-control-sm" style={{width:220}} value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button className="btn btn-outline-light" onClick={()=>{setShowForm(s=>!s)}}>{showForm ? 'Fechar' : 'Adicionar'}</button>
          <button className="btn btn-warning" onClick={async()=>{const p = await getParticipants(); setList(p)}}>Atualizar</button>
        </div>
      </div>

      {list.length === 0 && !showForm && (
        <div className="p-5 text-center rounded-3" style={{background:'#111'}}>
          <p className="mb-3 text-muted">Nenhum participante cadastrado.</p>
          <button className="btn btn-lg btn-warning" onClick={()=>setShowForm(true)}>Adicionar Participante</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-3 mb-4" style={{background:'#0f0f0f'}}>
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <label className="form-label">Nome</label>
              <input className="form-control" value={form.name} onChange={(e)=>handleChange('name', e.target.value)} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Nome fantasia</label>
              <input className="form-control" value={form.fantasyName} onChange={(e)=>handleChange('fantasyName', e.target.value)} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Data de nascimento</label>
              <input type="date" className="form-control" value={form.birthDate} onChange={(e)=>handleChange('birthDate', e.target.value)} />
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={form.type} onChange={(e)=>handleChange('type', e.target.value)}>
                <option value="mensalista">Mensalista</option>
                <option value="diarista">Diarista</option>
              </select>
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label">Posição</label>
              <select className="form-select" value={form.position} onChange={(e)=>handleChange('position', e.target.value)}>
                <option value="jogador">Jogador</option>
                <option value="goleiro">Goleiro</option>
                <option value="juiz">Juiz</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Ofensivo</label>
              <StarRating value={form.offense} onChange={(v)=>handleChange('offense', v)} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Defensivo</label>
              <StarRating value={form.defense} onChange={(v)=>handleChange('defense', v)} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Velocidade</label>
              <StarRating value={form.speed} onChange={(v)=>handleChange('speed', v)} />
            </div>

            <div className="col-12">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="activeSwitch" checked={form.active} onChange={(e)=>handleChange('active', e.target.checked)} />
                <label className="form-check-label text-muted" htmlFor="activeSwitch">Ativo</label>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Tipo pagamento</label>
              <select className="form-select" value={form.paymentType} onChange={(e)=>handleChange('paymentType', e.target.value)}>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label">Pago</label>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked={form.paymentPaid} onChange={(e)=>handleChange('paymentPaid', e.target.checked)} />
              </div>
            </div>

            <div className="col-12 d-flex gap-2 mt-2">
              <button className="btn btn-warning" type="submit">Salvar</button>
              <button className="btn btn-outline-light" type="button" onClick={()=>setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </form>
      )}

      <div className="row">
        {list.filter(p=> p.name && p.name.toLowerCase().includes(query.toLowerCase())).map(p=> (
          <div key={p.id} className="col-12 col-md-6 col-lg-4">
            <ParticipantCard p={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
