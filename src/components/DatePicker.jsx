import React, {useState, useRef, useEffect} from 'react'

function startOfMonth(date){
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysInMonth(date){
  return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()
}

function formatDisplay(iso){
  if(!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('pt-BR')
}

export default function DatePicker({value, onChange, placeholder='dd/mm/aaaa'}){
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
  const ref = useRef()

  useEffect(()=>{ setViewDate(value ? new Date(value) : new Date()) }, [value])

  useEffect(()=>{
    function handleClick(e){
      if(ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return ()=> document.removeEventListener('mousedown', handleClick)
  }, [])

  function handlePick(day){
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    onChange(d.toISOString().slice(0,10))
    setOpen(false)
  }

  function prevMonth(){ setViewDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1)) }
  function nextMonth(){ setViewDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1)) }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const first = startOfMonth(viewDate)
  const offset = first.getDay() // 0 (Sun) - 6 (Sat)
  const days = daysInMonth(viewDate)

  const today = new Date();
  const selected = value ? new Date(value) : null

  return (
    <div ref={ref} style={{position: 'relative'}}>
      <input
        readOnly
        className="form-control"
        value={formatDisplay(value)}
        placeholder={placeholder}
        onClick={()=>setOpen(o=>!o)}
        style={{
          background: '#0a0a0a',
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#fff',
          fontSize: '0.95rem',
          cursor: 'pointer'
        }}
      />

      {open && (
        <div className="custom-datepick" style={{position: 'absolute', zIndex: 60, right: 0, marginTop: '8px'}}>
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth}>{'\u25C0'}</button>
            <div className="dp-month">{viewDate.toLocaleString('pt-BR', {month: 'long', year: 'numeric'})}</div>
            <button type="button" className="dp-nav" onClick={nextMonth}>{'\u25B6'}</button>
          </div>
          <div className="dp-grid">
            {['D','S','T','Q','Q','S','S'].map((h,i)=>(
              <div key={i} className="dp-cell dp-head">{h}</div>
            ))}

            {Array.from({length: offset}).map((_,i)=> <div key={'e-'+i} className="dp-cell empty" />)}

            {Array.from({length: days}).map((_,i)=>{
              const day = i+1
              const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day
              const isSelected = selected && selected.getFullYear()===year && selected.getMonth()===month && selected.getDate()===day
              return (
                <button type="button" key={day} className={`dp-cell day ${isToday? 'today':''} ${isSelected? 'selected':''}`} onClick={()=>handlePick(day)}>
                  {day}
                </button>
              )
            })}
          </div>
          <div style={{display:'flex', gap:8, justifyContent:'space-between', padding:'8px 12px'}}>
            <button type="button" className="btn btn-sm btn-outline-light" onClick={()=>{ onChange(''); setOpen(false)}}>Limpar</button>
            <button type="button" className="btn btn-sm btn-outline-light" onClick={()=>{ const d=new Date(); onChange(d.toISOString().slice(0,10)); setOpen(false)}}>Hoje</button>
          </div>
        </div>
      )}
    </div>
  )
}
