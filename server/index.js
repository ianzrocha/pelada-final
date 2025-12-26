import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { getParticipants, addParticipant, updateParticipant, removeParticipant } from './db.js'
import { getMatches, addMatch, updateMatch, removeMatch, getMatch } from './db.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

app.get('/api/health', (req, res) => res.json({ok:true}))

app.get('/api/participants', (req, res) => {
  try{
    const rows = getParticipants()
    res.json(rows)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.post('/api/participants', (req, res) => {
  try{
    const id = addParticipant(req.body)
    res.status(201).json({id})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.put('/api/participants/:id', (req, res) => {
  try{
    updateParticipant(req.params.id, req.body)
    res.json({ok:true})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.delete('/api/participants/:id', (req, res) => {
  try{
    removeParticipant(req.params.id)
    res.json({ok:true})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

// Matches endpoints
app.get('/api/matches', (req, res) => {
  try{
    const rows = getMatches()
    res.json(rows)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.get('/api/matches/:id', (req, res) => {
  try{
    const m = getMatch(req.params.id)
    if(!m) return res.status(404).json({error:'not found'})
    res.json(m)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.post('/api/matches', (req, res) => {
  try{
    const id = addMatch(req.body)
    res.status(201).json({id})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.put('/api/matches/:id', (req, res) => {
  try{
    // update match data
    updateMatch(req.params.id, req.body)
    // if results provided, apply newly added results to participants
    if(req.body.results){
      try{
        // lazy import apply function from db
        import('./db.js').then(mod => {
          try{ mod.applyNewResultsToMatch(req.params.id, req.body.results) }catch(e){console.error('applyResults error', e)}
        })
      }catch(e){ console.error(e) }
    }
    res.json({ok:true})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.delete('/api/matches/:id', (req, res) => {
  try{
    removeMatch(req.params.id)
    res.json({ok:true})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'server error'})
  }
})

app.listen(port, ()=>{
  console.log(`Server listening on http://localhost:${port}`)
})
