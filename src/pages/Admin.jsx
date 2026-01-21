import React, {useEffect, useState} from 'react'
import {getParticipants, updateParticipant} from '../services/storage'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Admin(){
  const [list, setList] = useState([])

  useEffect(()=>{(async()=>{ setList(await getParticipants()) })()}, [])

  async function togglePaid(p){
    const next = {...p, paymentPaid: !p.paymentPaid}
    await updateParticipant(p.id, next)
    setList(await getParticipants())
  }

  async function changeType(p, type){
    const next = {...p, paymentType: type}
    await updateParticipant(p.id, next)
    setList(await getParticipants())
  }

  function exportCSV(){
    const headers = ['Nome','Tipo','Posição','Pago','TipoPagamento']
    const rows = list.map(p=> [p.name, p.type||'', p.position||'', (p.paymentPaid? 'Pago':'Pendente'), p.paymentType||''])
    const csv = [headers, ...rows].map(r=> r.map(c=> '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pagamentos.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const paid = list.filter(p=>p.paymentPaid).length
  const pending = list.length - paid
  const data = { labels:['Pago','Pendente'], datasets:[{ data:[paid,pending], backgroundColor:['#f6c84c','#6c6c6c'] }] }

  return (
    <div style={{maxWidth: '1400px', margin: '0 auto'}}>
      {/* Header Section */}
      <div style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #222'}}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="text-warning mb-1" style={{fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.5px'}}>Administração</h1>
            <p className="text-muted" style={{fontSize: '0.95rem', marginBottom: 0}}>Gerencie pagamentos e informações</p>
          </div>
          <button 
            className="btn btn-warning"
            onClick={exportCSV}
            style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats and Chart Section */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-5">
          <div 
            style={{
              background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem'
            }}
          >
            <h3 className="text-warning mb-4" style={{fontSize: '1.1rem', fontWeight: '600'}}>📊 Resumo de Pagamentos</h3>
            <div style={{height: '220px', marginBottom: '1.5rem'}}>
              <Pie data={data} />
            </div>
            <div className="text-muted small" style={{display: 'grid', gap: '0.5rem', fontSize: '0.9rem'}}>
              <div>Total de Participantes: <span className="text-warning">{list.length}</span></div>
              <div>Pago: <span style={{color: '#f6c84c'}}>{paid}</span></div>
              <div>Pendente: <span style={{color: '#6c6c6c'}}>{pending}</span></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div 
            style={{
              background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '2rem'
            }}
          >
            <h3 className="text-warning mb-4" style={{fontSize: '1.1rem', fontWeight: '600'}}>💰 Controle de Pagamentos</h3>
            <div className="table-responsive">
              <table className="table table-borderless align-middle" style={{marginBottom: 0}}>
                <thead>
                  <tr className="text-muted small" style={{borderBottom: '1px solid #333'}}>
                    <th style={{paddingBottom: '1rem'}}>Nome</th>
                    <th style={{paddingBottom: '1rem'}}>Tipo</th>
                    <th style={{paddingBottom: '1rem'}}>Status</th>
                    <th style={{paddingBottom: '1rem'}}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(p=> (
                    <tr key={p.id} style={{borderBottom: '1px solid #222'}}>
                      <td className="text-warning" style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
                        <span style={{fontSize: '0.95rem'}}>{p.name}</span>
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm" 
                          value={p.paymentType||'mensal'} 
                          onChange={(e)=>changeType(p, e.target.value)}
                          style={{
                            background: '#0a0a0a',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            padding: '0.4rem 0.6rem',
                            color: '#fff',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="mensal">Mensal</option>
                          <option value="anual">Anual</option>
                        </select>
                      </td>
                      <td>
                        {p.paymentPaid ? (
                          <span className="badge" style={{background: '#28a745', color: '#fff'}}>✓ Pago</span>
                        ) : (
                          <span className="badge" style={{background: '#6c6c6c', color: '#fff'}}>⏳ Pendente</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-light" 
                          onClick={()=>togglePaid(p)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            borderRadius: '6px',
                            border: '1px solid #555'
                          }}
                        >
                          {p.paymentPaid ? 'Desfazer' : 'Marcar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
