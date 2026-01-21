import type { Participant, Match, MatchParticipant, MatchResult } from '../types'

const API_URL = 'http://localhost:4000/api'

// ========== PARTICIPANTS ==========

export async function getParticipants(): Promise<Participant[]> {
  try {
    const res = await fetch(`${API_URL}/participants`);
    if (res.ok) {
      const data = await res.json();
      return data.sort((a: Participant, b: Participant) =>
        (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
      );
    }
  } catch (err) {
    console.error('Erro ao buscar participantes:', err);
  }
  return [];
}

export async function addParticipant(participant: Participant): Promise<Participant | null> {
  try {
    const res = await fetch(`${API_URL}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant),
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Participante adicionado com sucesso:', data);
      return data;
    } else {
      const error = await res.text();
      console.error('Erro ao adicionar participante:', error);
    }
  } catch (err) {
    console.error('Erro de conexão ao adicionar participante:', err);
  }
  return null;
}

export async function updateParticipant(id: number, participant: Partial<Participant>): Promise<Participant | null> {
  try {
    const res = await fetch(`${API_URL}/participants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao atualizar participante:', err);
  }
  return null;
}

export async function removeParticipant(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/participants/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao remover participante:', err);
  }
  return false;
}

// ========== MATCHES ==========

export async function getMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${API_URL}/matches`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao buscar partidas:', err);
  }
  return [];
}

export async function addMatch(match: Match): Promise<Match | null> {
  try {
    const res = await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao criar partida:', err);
  }
  return null;
}

export async function updateMatch(id: number, match: Partial<Match>): Promise<Match | null> {
  try {
    const res = await fetch(`${API_URL}/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao atualizar partida:', err);
  }
  return null;
}

export async function removeMatch(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/matches/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao remover partida:', err);
  }
  return false;
}

// ========== MATCH PARTICIPANTS ==========

export async function getMatchParticipants(matchId: number): Promise<MatchParticipant[]> {
  try {
    const res = await fetch(`${API_URL}/matches/${matchId}/participants`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao buscar participantes da partida:', err);
  }
  return [];
}

export async function addMatchParticipant(matchId: number, participantId: number, arrivalOrder?: number): Promise<MatchParticipant | null> {
  try {
    const res = await fetch(`${API_URL}/matches/${matchId}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant_id: participantId, arrival_order: arrivalOrder }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao adicionar participante à partida:', err);
  }
  return null;
}

export async function removeMatchParticipant(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/match-participants/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao remover participante da partida:', err);
  }
  return false;
}

// ========== MATCH RESULTS ==========

export async function getMatchResults(matchId: number): Promise<MatchResult[]> {
  try {
    const res = await fetch(`${API_URL}/matches/${matchId}/results`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Erro ao buscar resultados da partida:', err);
  }
  return [];
}
