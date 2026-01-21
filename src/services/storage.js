// Storage em memória apenas (sem persistência)
let participantsList = []
let matchesList = []
let meta = {}

export async function getParticipants(){
  // monthly reset of fouls and cards
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  if(meta.lastResetMonth !== currentMonth){
    participantsList = participantsList.map(p => ({...p, fouls:0, cards:0}))
    meta.lastResetMonth = currentMonth
  }
  
  participantsList.sort((a,b)=> (a.name||'').localeCompare(b.name||'', undefined, {sensitivity:'base'}))
  return participantsList
}

export async function saveParticipants(list){
  participantsList = list
}

export async function addParticipant(p){
  const id = generateId()
  const base = {id, goals:0, ownGoals:0, matches:0, fouls:0, cards:0}
  participantsList.push({...base, ...p})
  return id
}

export async function updateParticipant(id, p){
  const idx = participantsList.findIndex(x=>x.id===id)
  if(idx>=0){ participantsList[idx] = {...participantsList[idx], ...p} }
}

export async function removeParticipant(id){
  participantsList = participantsList.filter(x=>x.id!==id)
}

export async function getMatches(){
  return matchesList
}

export async function addMatch(m){
  const id = 'm_' + Math.random().toString(36).slice(2,9)
  matchesList.push({...m, id})
  return id
}

export async function updateMatch(id, m){
  const idx = matchesList.findIndex(x=>x.id===id)
  if(idx>=0){ matchesList[idx] = {...matchesList[idx], ...m} }
}

export async function removeMatch(id){
  matchesList = matchesList.filter(x=>x.id!==id)
}

function generateId(){
  return 'p_' + Math.random().toString(36).slice(2,9)
}

export function clearAll(){
  participantsList = []
  matchesList = []
  meta = {}
  console.log('✅ Dados limpos')
}

export default {
  getParticipants, saveParticipants, addParticipant, updateParticipant, removeParticipant,
  getMatches, addMatch, updateMatch, removeMatch, clearAll
}
