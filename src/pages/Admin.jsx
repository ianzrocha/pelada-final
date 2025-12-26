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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-warning">Administração</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={exportCSV}>Exportar CSV</button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card p-3 mb-3">
            <h6 className="muted">Resumo de pagamentos</h6>
            <div style={{height:180}}>
              <Pie data={data} />
            </div>
            <div className="mt-2 muted small">Total: {list.length} • Pago: {paid} • Pendente: {pending}</div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card p-3 mb-3">
            <h6 className="muted">Controle de pagamentos</h6>
            <div className="table-responsive mt-2">
              <table className="table table-borderless align-middle">
                <thead>
                  <tr className="muted small"><th>Nome</th><th>Tipo</th><th>Pago</th><th></th></tr>
                </thead>
                <tbody>
                  {list.map(p=> (
                    <tr key={p.id}>
                      <td className="text-warning">{p.name}</td>
                      <td>
                        <select className="form-select form-select-sm" value={p.paymentType||'mensal'} onChange={(e)=>changeType(p, e.target.value)}>
                          <option value="mensal">Mensal</option>
                          <option value="anual">Anual</option>
                        </select>
                      </td>
                      <td>{p.paymentPaid ? <span className="badge bg-success">Pago</span> : <span className="badge bg-secondary">Pendente</span>}</td>
                      <td><button className="btn btn-sm btn-ghost" onClick={()=>togglePaid(p)}>{p.paymentPaid ? 'Marcar Pendente' : 'Marcar Pago'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
