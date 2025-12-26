import fs from 'fs'
import path from 'path'

const DB_FILE = path.resolve(process.cwd(), 'server', 'data.json')

function loadDB(){
  try{
    if(!fs.existsSync(DB_FILE)){
      const initial = { participants: [], meta: { lastResetMonth: '' }, matches: [] }
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8')
      return initial
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8')
    const data = JSON.parse(raw)
    data.participants = data.participants || []
    data.meta = data.meta || { lastResetMonth: '' }
    data.matches = data.matches || []
    return data
  }catch(e){
    console.error('DB load error', e)
    return { participants: [], meta: { lastResetMonth: '' }, matches: [] }
  }
}

function saveDB(db){
  try{ fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8') }catch(e){ console.error('DB save error', e) }
}

let DB = loadDB()

function generateId(prefix='p'){
  return `${prefix}_` + Math.random().toString(36).slice(2,9)
}

export function getParticipants(){
  // monthly reset
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${now.getMonth()+1}`
  if(DB.meta.lastResetMonth !== currentMonth){
    DB.participants = DB.participants.map(p => ({...p, fouls:0, cards:0}))
    DB.meta.lastResetMonth = currentMonth
    saveDB(DB)
  }
  return DB.participants
}

export function addParticipant(p){
  const id = p.id || generateId('p')
  const base = {id, name: p.name||'', fantasyName: p.fantasyName||'', birthDate: p.birthDate||'', type: p.type||'mensalista', position: p.position||'jogador', active: p.active!==undefined ? !!p.active : true, offense: p.offense||0, defense: p.defense||0, speed: p.speed||0, goals: p.goals||0, ownGoals: p.ownGoals||0, matches: p.matches||0, fouls: p.fouls||0, cards: p.cards||0 }
  DB.participants.push(base)
  saveDB(DB)
  return id
}

export function updateParticipant(id, p){
  const idx = DB.participants.findIndex(x=>x.id===id)
  if(idx===-1) return
  DB.participants[idx] = {...DB.participants[idx], ...p}
  saveDB(DB)
}

export function removeParticipant(id){
  DB.participants = DB.participants.filter(x=>x.id!==id)
  saveDB(DB)
}

export function getMatches(){
  // return ordered by date desc if date set
  return DB.matches.slice().sort((a,b)=> (b.date||'').localeCompare(a.date||''))
}

export function getMatch(id){
  const m = DB.matches.find(x=>x.id===id)
  return m || null
}

export function addMatch(m){
  const id = m.id || generateId('m')
  const rec = { id, title: m.title||'', description: m.description||'', date: m.date||'', games: m.games||1, organization: m.organization||[], results: m.results||[] }
  DB.matches.push(rec)
  saveDB(DB)
  return id
}

export function updateMatch(id, m){
  const idx = DB.matches.findIndex(x=>x.id===id)
  if(idx===-1) return
  const prev = DB.matches[idx]
  DB.matches[idx] = {...prev, ...m}
  saveDB(DB)
}

export function removeMatch(id){
  DB.matches = DB.matches.filter(x=>x.id!==id)
  saveDB(DB)
}

export function applyNewResultsToMatch(id, newResults){
  const match = getMatch(id)
  if(!match) return
  const prev = match.results || []
  const startIndex = prev.length
  const appended = (newResults || []).slice(startIndex)
  if(appended.length === 0) return

  // if first time results added, increment matches for all participants in organization
  if(prev.length === 0 && match.organization && match.organization.length){
    match.organization.forEach(pid=>{
      const p = DB.participants.find(x=>x.id===pid)
      if(p) p.matches = (p.matches||0) + 1
    })
  }

  // increment goals per scorer
  appended.forEach(result => {
    const scorers = result.scorers || []
    scorers.forEach(s => {
      if(s.playerId && s.goals && s.goals > 0){
        const p = DB.participants.find(x=>x.id===s.playerId)
        if(p) p.goals = (p.goals||0) + s.goals
      }
    })
  })

  // merge results into match and save
  match.results = (match.results || []).concat(appended)
  saveDB(DB)
}

export default DB
// Apply newly added results (only applies appended results to avoid double counting)
export function applyNewResultsToMatch(id, newResults){
  const existing = getMatch(id)
  const prev = existing ? (existing.results || []) : []
  const startIndex = prev.length
  const appended = (newResults || []).slice(startIndex)
  if(appended.length === 0) return

  // If this is the first time results are added, increment matches count for all participants in organization by 1
  if(prev.length === 0 && existing){
    const orgIds = existing.organization || []
    const incMatches = db.prepare('UPDATE participants SET matches = matches + 1 WHERE id = ?')
    orgIds.forEach(pid => incMatches.run(pid))
  }

  // For each appended result, update goals for scorers
  const incGoals = db.prepare('UPDATE participants SET goals = goals + ? WHERE id = ?')
  appended.forEach(result => {
    const scorers = result.scorers || []
    scorers.forEach(s => {
      if(s.playerId && s.goals && s.goals > 0){
        incGoals.run(s.goals, s.playerId)
      }
    })
  })
}

export default db
