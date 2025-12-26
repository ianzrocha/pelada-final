import React, {useEffect, useState} from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { getParticipants } from '../services/storage'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ParticipantsChart(){
  const [data, setData] = useState({labels:[], datasets:[]})

  useEffect(()=>{(async()=>{
    const list = await getParticipants()
    const positions = {}
    list.forEach(p=>{
      const pos = p.position || 'jogador'
      positions[pos] = (positions[pos]||0) + 1
    })

    setData({
      labels: Object.keys(positions),
      datasets: [
        { label: 'Por posição', data: Object.values(positions), backgroundColor: '#f6c84c' }
      ]
    })
  })()}, [])

  const options = { responsive:true, plugins:{ legend:{ display:false } } }

  return (
    <div>
      <h6 className="muted">Distribuição por posição</h6>
      <div style={{height:220}}>
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}
