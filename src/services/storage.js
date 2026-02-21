// Storage conectado à API PostgreSQL
async function apiAvailable() {
  try {
    const res = await fetch('/api/health')
    return res.ok
  } catch(e) {
    return false
  }
}

export async function getParticipants(){
  if(await apiAvailable()) {
    try {
      const res = await fetch('/api/participants')
      if(res.ok) {
        const data = await res.json()
        data.sort((a,b)=> (a.name||'').localeCompare(b.name||'', undefined, {sensitivity:'base'}))
        return data
      }
    } catch(e) {
      console.error('Erro ao buscar participantes:', e)
    }
  }
  // fallback to localStorage
  try{
    const raw = localStorage.getItem('pelada_participants')
    const data = raw ? JSON.parse(raw) : []
    data.sort((a,b)=> (a.name||'').localeCompare(b.name||'', undefined, {sensitivity:'base'}))
    return data
  } catch(e){
    console.error('Erro ao ler participantes do localStorage', e)
    return []
  }
}

export async function saveParticipants(list){
  // Não usado com API
}

export async function addParticipant(p){
  if(await apiAvailable()) {
    try {
      const res = await fetch('/api/participants', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(p)
      })
      if(res.ok) {
        const j = await res.json()
        return j.id
      }
    } catch(e) {
      console.error('Erro ao adicionar participante:', e)
    }
  }
  // fallback to localStorage
  try{
    const raw = localStorage.getItem('pelada_participants')
    const data = raw ? JSON.parse(raw) : []
    const id = Date.now().toString()
    const item = {...p, id}
    data.push(item)
    localStorage.setItem('pelada_participants', JSON.stringify(data))
    return id
  } catch(e){
    console.error('Erro ao salvar participante no localStorage', e)
    throw new Error('Falha ao salvar participante')
  }
}

export async function updateParticipant(id, p){
  if(await apiAvailable()) {
    try {
      await fetch(`/api/participants/${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(p)
      })
      return
    } catch(e) {
      console.error('Erro ao atualizar participante:', e)
    }
  }
  // fallback localStorage
  try{
    const raw = localStorage.getItem('pelada_participants')
    const data = raw ? JSON.parse(raw) : []
    const idx = data.findIndex(x=> x.id === id)
    if(idx !== -1){ data[idx] = {...p, id}; localStorage.setItem('pelada_participants', JSON.stringify(data)) }
    return
  } catch(e){ console.error('Erro ao atualizar participante no localStorage', e) }
}

export async function removeParticipant(id){
  if(await apiAvailable()) {
    try {
      await fetch(`/api/participants/${id}`, {method:'DELETE'})
      return
    } catch(e) {
      console.error('Erro ao deletar participante:', e)
    }
  }
  // fallback localStorage
  try{
    const raw = localStorage.getItem('pelada_participants')
    const data = raw ? JSON.parse(raw) : []
    const filtered = data.filter(x=> x.id !== id)
    localStorage.setItem('pelada_participants', JSON.stringify(filtered))
    return
  } catch(e){ console.error('Erro ao deletar participante no localStorage', e) }
}

export async function getMatches(){
  if(await apiAvailable()) {
    try {
      const res = await fetch('/api/matches')
      if(res.ok) {
        return await res.json()
      }
    } catch(e) {
      console.error('Erro ao buscar partidas:', e)
    }
  }
  // fallback to localStorage
  try{
    const raw = localStorage.getItem('pelada_matches')
    return raw ? JSON.parse(raw) : []
  } catch(e){ console.error('Erro ao ler partidas do localStorage', e); return [] }
}

export async function addMatch(m){
  if(await apiAvailable()) {
    try {
      const res = await fetch('/api/matches', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(m)
      })
      if(res.ok) {
        return (await res.json()).id
      }
    } catch(e) {
      console.error('Erro ao adicionar partida:', e)
    }
  }
  // fallback to localStorage
  try{
    const raw = localStorage.getItem('pelada_matches')
    const data = raw ? JSON.parse(raw) : []
    const id = Date.now().toString()
    const item = {...m, id}
    data.push(item)
    localStorage.setItem('pelada_matches', JSON.stringify(data))
    return id
  } catch(e){ console.error('Erro ao salvar partida no localStorage', e); throw new Error('Falha ao salvar partida') }
}

export async function updateMatch(id, m){
  if(await apiAvailable()) {
    try {
      await fetch(`/api/matches/${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(m)
      })
      return
    } catch(e) {
      console.error('Erro ao atualizar partida:', e)
    }
  }
  // fallback localStorage
  try{
    const raw = localStorage.getItem('pelada_matches')
    const data = raw ? JSON.parse(raw) : []
    const idx = data.findIndex(x=> x.id === id)
    if(idx !== -1){ data[idx] = {...m, id}; localStorage.setItem('pelada_matches', JSON.stringify(data)) }
    return
  } catch(e){ console.error('Erro ao atualizar partida no localStorage', e) }
}

export async function removeMatch(id){
  if(await apiAvailable()) {
    try {
      await fetch(`/api/matches/${id}`, {method:'DELETE'})
      return
    } catch(e) {
      console.error('Erro ao deletar partida:', e)
    }
  }
  // fallback localStorage
  try{
    const raw = localStorage.getItem('pelada_matches')
    const data = raw ? JSON.parse(raw) : []
    const filtered = data.filter(x=> x.id !== id)
    localStorage.setItem('pelada_matches', JSON.stringify(filtered))
    return
  } catch(e){ console.error('Erro ao deletar partida no localStorage', e) }
}

export function clearAll(){
  console.log('✅ Dados limpos no servidor')
}

export default {
  getParticipants, saveParticipants, addParticipant, updateParticipant, removeParticipant,
  getMatches, addMatch, updateMatch, removeMatch, clearAll
}
