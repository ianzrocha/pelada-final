import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeDatabase } from './init-db';
import * as db from './db';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database on startup
initializeDatabase().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ========== PARTICIPANTS ENDPOINTS ==========

app.get('/api/participants', async (req, res) => {
  try {
    const participants = await db.getParticipants();
    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar participantes' });
  }
});

app.get('/api/participants/:id', async (req, res) => {
  try {
    const participant = await db.getParticipantById(parseInt(req.params.id));
    if (!participant) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }
    res.json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar participante' });
  }
});

app.post('/api/participants', async (req, res) => {
  try {
    const participant = await db.addParticipant(req.body);
    res.status(201).json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar participante' });
  }
});

app.put('/api/participants/:id', async (req, res) => {
  try {
    const participant = await db.updateParticipant(parseInt(req.params.id), req.body);
    if (!participant) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }
    res.json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar participante' });
  }
});

app.delete('/api/participants/:id', async (req, res) => {
  try {
    const participant = await db.removeParticipant(parseInt(req.params.id));
    if (!participant) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }
    res.json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover participante' });
  }
});

// ========== MATCHES ENDPOINTS ==========

app.get('/api/matches', async (req, res) => {
  try {
    const matches = await db.getMatches();
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar partidas' });
  }
});

app.get('/api/matches/:id', async (req, res) => {
  try {
    const match = await db.getMatchById(parseInt(req.params.id));
    if (!match) {
      return res.status(404).json({ error: 'Partida não encontrada' });
    }
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar partida' });
  }
});

app.post('/api/matches', async (req, res) => {
  try {
    const match = await db.addMatch(req.body);
    res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar partida' });
  }
});

app.put('/api/matches/:id', async (req, res) => {
  try {
    const match = await db.updateMatch(parseInt(req.params.id), req.body);
    if (!match) {
      return res.status(404).json({ error: 'Partida não encontrada' });
    }
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar partida' });
  }
});

app.delete('/api/matches/:id', async (req, res) => {
  try {
    const match = await db.removeMatch(parseInt(req.params.id));
    if (!match) {
      return res.status(404).json({ error: 'Partida não encontrada' });
    }
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover partida' });
  }
});

// ========== MATCH PARTICIPANTS ENDPOINTS ==========

app.get('/api/matches/:matchId/participants', async (req, res) => {
  try {
    const participants = await db.getMatchParticipants(parseInt(req.params.matchId));
    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar participantes da partida' });
  }
});

app.post('/api/matches/:matchId/participants', async (req, res) => {
  try {
    const mp = await db.addMatchParticipant(
      parseInt(req.params.matchId),
      req.body.participant_id,
      req.body.arrival_order
    );
    res.status(201).json(mp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar participante à partida' });
  }
});

app.put('/api/match-participants/:id', async (req, res) => {
  try {
    const mp = await db.updateMatchParticipant(parseInt(req.params.id), req.body);
    res.json(mp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar participante da partida' });
  }
});

app.delete('/api/match-participants/:id', async (req, res) => {
  try {
    await db.removeMatchParticipant(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover participante da partida' });
  }
});

// ========== MATCH RESULTS ENDPOINTS ==========

app.get('/api/matches/:matchId/results', async (req, res) => {
  try {
    const results = await db.getMatchResults(parseInt(req.params.matchId));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar resultados da partida' });
  }
});

app.put('/api/match-results/:id', async (req, res) => {
  try {
    const result = await db.updateMatchResult(parseInt(req.params.id), req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar resultado da partida' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
