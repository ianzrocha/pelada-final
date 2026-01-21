import pool from './pool';

// ========== PARTICIPANTS ==========

export async function getParticipants() {
  const result = await pool.query('SELECT * FROM participants ORDER BY name ASC');
  return result.rows;
}

export async function getParticipantById(id: number) {
  const result = await pool.query('SELECT * FROM participants WHERE id = $1', [id]);
  return result.rows[0];
}

export async function addParticipant(p: any) {
  const {
    name,
    fantasy_name,
    birth_date,
    type,
    position,
    active,
    offensive_rating,
    defensive_rating,
    speed_rating,
  } = p;
  const birth = typeof birth_date === 'string' ? (birth_date.trim() === '' ? null : birth_date) : birth_date ?? null;

  const result = await pool.query(
    `INSERT INTO participants 
    (name, fantasy_name, birth_date, type, position, active, offensive_rating, defensive_rating, speed_rating) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *`,
    [name, fantasy_name, birth, type, position, active ?? true, offensive_rating ?? 1, defensive_rating ?? 1, speed_rating ?? 1]
  );
  return result.rows[0];
}

export async function updateParticipant(id: number, p: any) {
  const {
    name,
    fantasy_name,
    birth_date,
    type,
    position,
    active,
    offensive_rating,
    defensive_rating,
    speed_rating,
    fouls,
    cards,
    goals,
    own_goals,
    matches_played,
  } = p;

  const result = await pool.query(
    `UPDATE participants 
    SET name = $1, fantasy_name = $2, birth_date = $3, type = $4, position = $5, active = $6, 
        offensive_rating = $7, defensive_rating = $8, speed_rating = $9, fouls = $10, cards = $11, 
        goals = $12, own_goals = $13, matches_played = $14, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $15 
    RETURNING *`,
    [name, fantasy_name, (typeof birth_date === 'string' ? (birth_date.trim() === '' ? null : birth_date) : birth_date), type, position, active, offensive_rating, defensive_rating, speed_rating, fouls, cards, goals, own_goals, matches_played, id]
  );
  return result.rows[0];
}

export async function removeParticipant(id: number) {
  await pool.query('DELETE FROM match_participants WHERE participant_id = $1', [id]);
  const result = await pool.query('DELETE FROM participants WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

// ========== MATCHES ==========

export async function getMatches() {
  const result = await pool.query('SELECT * FROM matches ORDER BY match_date DESC');
  return result.rows;
}

export async function getMatchById(id: number) {
  const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
  return result.rows[0];
}

export async function addMatch(m: any) {
  const { title, description, match_date, games_count } = m;
  const result = await pool.query(
    `INSERT INTO matches (title, description, match_date, games_count) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`,
    [title, description, match_date, games_count ?? 1]
  );
  return result.rows[0];
}

export async function updateMatch(id: number, m: any) {
  const { title, description, match_date, games_count, status } = m;
  const result = await pool.query(
    `UPDATE matches 
    SET title = $1, description = $2, match_date = $3, games_count = $4, status = $5, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $6 
    RETURNING *`,
    [title, description, match_date, games_count, status, id]
  );
  return result.rows[0];
}

export async function removeMatch(id: number) {
  await pool.query('DELETE FROM match_results WHERE match_id = $1', [id]);
  await pool.query('DELETE FROM match_participants WHERE match_id = $1', [id]);
  const result = await pool.query('DELETE FROM matches WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

// ========== MATCH PARTICIPANTS ==========

export async function addMatchParticipant(match_id: number, participant_id: number, arrival_order?: number) {
  const result = await pool.query(
    `INSERT INTO match_participants (match_id, participant_id, arrival_order) 
    VALUES ($1, $2, $3) 
    RETURNING *`,
    [match_id, participant_id, arrival_order]
  );
  return result.rows[0];
}

export async function getMatchParticipants(match_id: number) {
  const result = await pool.query(
    `SELECT mp.*, p.* FROM match_participants mp 
    JOIN participants p ON mp.participant_id = p.id 
    WHERE mp.match_id = $1 
    ORDER BY mp.arrival_order ASC`,
    [match_id]
  );
  return result.rows;
}

export async function updateMatchParticipant(id: number, data: any) {
  const { team, goals, own_goals, fouls, cards } = data;
  const result = await pool.query(
    `UPDATE match_participants 
    SET team = $1, goals = $2, own_goals = $3, fouls = $4, cards = $5 
    WHERE id = $6 
    RETURNING *`,
    [team, goals, own_goals, fouls, cards, id]
  );
  return result.rows[0];
}

export async function removeMatchParticipant(id: number) {
  await pool.query('DELETE FROM match_participants WHERE id = $1', [id]);
}

// ========== MATCH RESULTS ==========

export async function getMatchResults(match_id: number) {
  const result = await pool.query(
    `SELECT * FROM match_results WHERE match_id = $1 ORDER BY game_number ASC`,
    [match_id]
  );
  return result.rows;
}

export async function updateMatchResult(id: number, data: any) {
  const { team1_goals, team2_goals, status } = data;
  const result = await pool.query(
    `UPDATE match_results 
    SET team1_goals = $1, team2_goals = $2, status = $3, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $4 
    RETURNING *`,
    [team1_goals, team2_goals, status, id]
  );
  return result.rows[0];
}
