import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initDb } from './init-db.js'
import { 
  getParticipants, addParticipant, updateParticipant, removeParticipant,
  getMatches, getMatch, addMatch, updateMatch, removeMatch
} from './db.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

// Initialize database on startup
await initDb()

app.get('/api/health', (req, res) => res.json({ok:true}))

// PARTICIPANTS ENDPOINTS

app.get('/api/participants', async (req, res) => {
  try {
    const rows = await getParticipants()
    res.json(rows)
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.post('/api/participants', async (req, res) => {
  try {
    const id = await addParticipant(req.body)
    res.status(201).json({id})
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.put('/api/participants/:id', async (req, res) => {
  try {
    await updateParticipant(req.params.id, req.body)
    res.json({ok:true})
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.delete('/api/participants/:id', async (req, res) => {
  try {
    await removeParticipant(req.params.id)
    res.json({ok:true})
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

// MATCHES ENDPOINTS

app.get('/api/matches', async (req, res) => {
  try {
    const rows = await getMatches()
    res.json(rows)
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.get('/api/matches/:id', async (req, res) => {
  try {
    const m = await getMatch(req.params.id)
    if(!m) return res.status(404).json({error:'not found'})
    res.json(m)
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.post('/api/matches', async (req, res) => {
  try {
    const id = await addMatch(req.body)
    res.status(201).json({id})
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.put('/api/matches/:id', async (req, res) => {
  try {
    await updateMatch(req.params.id, req.body)
    res.json({ok:true})
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.delete('/api/matches/:id', async (req, res) => {
  try {
    await removeMatch(req.params.id)
    res.json({ok:true})
  } catch(e) {
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.listen(port, ()=>{
  console.log(`✅ Server listening on http://localhost:${port}`)
})
