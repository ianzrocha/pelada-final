const KEY_PARTICIPANTS = 'pelada_participants_v1'
const KEY_META = 'pelada_meta_v1'
const KEY_MATCHES = 'pelada_matches_v1'

function loadJSON(key){
  try{
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  }catch(e){ return null }
}
function saveJSON(key, data){
  localStorage.setItem(key, JSON.stringify(data))
}

async function apiAvailable(){
  try{
    const res = await fetch('/api/health')
    return res.ok
  }catch(e){
    return false
  }
}

export async function getParticipants(){
  if(await apiAvailable()){
    try{
      const res = await fetch('/api/participants')
      if(res.ok){
        const data = await res.json()
        // ensure alphabetical order
        data.sort((a,b)=> (a.name||'').localeCompare(b.name||'', undefined, {sensitivity:'base'}))
        return data
      }
    }catch(e){ /* fallthrough to localStorage */ }
  }

  const meta = loadJSON(KEY_META) || {}
  let list = loadJSON(KEY_PARTICIPANTS) || []
  // monthly reset of fouls and cards
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${now.getMonth()+1}`
  if(meta.lastResetMonth !== currentMonth){
    list = list.map(p => ({...p, fouls:0, cards:0}))
    meta.lastResetMonth = currentMonth
    saveJSON(KEY_PARTICIPANTS, list)
    saveJSON(KEY_META, meta)
  }
  list.sort((a,b)=> (a.name||'').localeCompare(b.name||'', undefined, {sensitivity:'base'}))
  return list
}

export async function saveParticipants(list){
  if(await apiAvailable()){
    // server bulk save not implemented; fallback to localStorage for now
  }
  saveJSON(KEY_PARTICIPANTS, list)
}

export async function addParticipant(p){
  if(await apiAvailable()){
    try{
      const res = await fetch('/api/participants', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p)})
      if(res.ok){
        const j = await res.json()
        return j.id
      }
    }catch(e){ /* fallback */ }
  }

  const list = await getParticipants()
  const id = generateId()
  const base = {id, goals:0, ownGoals:0, matches:0, fouls:0, cards:0}
  list.push({...base, ...p})
  saveJSON(KEY_PARTICIPANTS, list)
  return id
}

export async function updateParticipant(id, p){
  if(await apiAvailable()){
    try{
      await fetch(`/api/participants/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p)})
      return
    }catch(e){}
  }
  const list = await getParticipants()
  const idx = list.findIndex(x=>x.id===id)
  if(idx>=0){ list[idx] = {...list[idx], ...p}; saveJSON(KEY_PARTICIPANTS, list) }
}

export async function getMatches(){
  if(await apiAvailable()){
    try{
      const res = await fetch('/api/matches')
      if(res.ok){
        const data = await res.json()
        return data
      }
    }catch(e){}
  }
  const raw = loadJSON(KEY_MATCHES) || []
  return raw
}

export async function addMatch(m){
  if(await apiAvailable()){
    try{
      const res = await fetch('/api/matches', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(m)})
      if(res.ok){
        return (await res.json()).id
      }
    }catch(e){}
  }
  const list = loadJSON(KEY_MATCHES) || []
  const id = 'm_' + Math.random().toString(36).slice(2,9)
  list.push({...m, id})
  saveJSON(KEY_MATCHES, list)
  return id
}

export async function updateMatch(id, m){
  if(await apiAvailable()){
    try{
      await fetch(`/api/matches/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(m)})
      return
    }catch(e){}
  }
  const list = loadJSON(KEY_MATCHES) || []
  const idx = list.findIndex(x=>x.id===id)
  if(idx>=0){ list[idx] = {...list[idx], ...m}; saveJSON(KEY_MATCHES, list) }
}

export async function removeMatch(id){
  if(await apiAvailable()){
    try{ await fetch(`/api/matches/${id}`, {method:'DELETE'}) ; return }catch(e){}
  }
  const list = loadJSON(KEY_MATCHES) || []
  saveJSON(KEY_MATCHES, list.filter(x=>x.id!==id))
}

function generateId(){
  return 'p_' + Math.random().toString(36).slice(2,9)
}

export function clearAll(){
  localStorage.removeItem(KEY_PARTICIPANTS)
  localStorage.removeItem(KEY_META)
}

export default {
  getParticipants, saveParticipants, addParticipant, updateParticipant, clearAll
}
