import pool from './pool.js'

function generateId(prefix = 'p') {
  return `${prefix}_` + Math.random().toString(36).slice(2, 9)
}

// PARTICIPANTS

export async function getParticipants() {
  const result = await pool.query('SELECT * FROM participants ORDER BY name')
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    fantasyName: row.fantasy_name,
    birthDate: row.birth_date,
    age: row.age,
    type: row.type,
    position: row.position,
    active: row.active,
    offense: row.offense,
    defense: row.defense,
    speed: row.speed,
    goals: row.goals,
    ownGoals: row.own_goals,
    matches: row.matches,
    fouls: row.fouls,
    cards: row.cards,
    paymentType: row.payment_type,
    paymentPaid: row.payment_paid
  }))
}

export async function addParticipant(p) {
  const id = p.id || generateId('p')
  
  await pool.query(
    `INSERT INTO participants (id, name, fantasy_name, birth_date, age, type, position, active, offense, defense, speed, payment_type, payment_paid)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      id,
      p.name,
      p.fantasyName || null,
      p.birthDate || null,
      p.age || null,
      p.type || 'mensalista',
      p.position || 'jogador',
      p.active !== false,
      p.offense || 0,
      p.defense || 0,
      p.speed || 0,
      p.paymentType || 'mensal',
      p.paymentPaid || false
    ]
  )
  
  return id
}

export async function updateParticipant(id, p) {
  const updates = []
  const values = []
  let paramCount = 1
  
  if (p.name !== undefined) {
    updates.push(`name = $${paramCount++}`)
    values.push(p.name)
  }
  if (p.fantasyName !== undefined) {
    updates.push(`fantasy_name = $${paramCount++}`)
    values.push(p.fantasyName)
  }
  if (p.birthDate !== undefined) {
    updates.push(`birth_date = $${paramCount++}`)
    values.push(p.birthDate)
  }
  if (p.age !== undefined) {
    updates.push(`age = $${paramCount++}`)
    values.push(p.age)
  }
  if (p.type !== undefined) {
    updates.push(`type = $${paramCount++}`)
    values.push(p.type)
  }
  if (p.position !== undefined) {
    updates.push(`position = $${paramCount++}`)
    values.push(p.position)
  }
  if (p.active !== undefined) {
    updates.push(`active = $${paramCount++}`)
    values.push(p.active)
  }
  if (p.offense !== undefined) {
    updates.push(`offense = $${paramCount++}`)
    values.push(p.offense)
  }
  if (p.defense !== undefined) {
    updates.push(`defense = $${paramCount++}`)
    values.push(p.defense)
  }
  if (p.speed !== undefined) {
    updates.push(`speed = $${paramCount++}`)
    values.push(p.speed)
  }
  if (p.goals !== undefined) {
    updates.push(`goals = $${paramCount++}`)
    values.push(p.goals)
  }
  if (p.ownGoals !== undefined) {
    updates.push(`own_goals = $${paramCount++}`)
    values.push(p.ownGoals)
  }
  if (p.matches !== undefined) {
    updates.push(`matches = $${paramCount++}`)
    values.push(p.matches)
  }
  if (p.fouls !== undefined) {
    updates.push(`fouls = $${paramCount++}`)
    values.push(p.fouls)
  }
  if (p.cards !== undefined) {
    updates.push(`cards = $${paramCount++}`)
    values.push(p.cards)
  }
  if (p.paymentType !== undefined) {
    updates.push(`payment_type = $${paramCount++}`)
    values.push(p.paymentType)
  }
  if (p.paymentPaid !== undefined) {
    updates.push(`payment_paid = $${paramCount++}`)
    values.push(p.paymentPaid)
  }
  
  if (updates.length === 0) return
  
  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(id)
  
  await pool.query(
    `UPDATE participants SET ${updates.join(', ')} WHERE id = $${paramCount}`,
    values
  )
}

export async function removeParticipant(id) {
  await pool.query('DELETE FROM participants WHERE id = $1', [id])
}

// MATCHES

export async function getMatches() {
  const result = await pool.query('SELECT * FROM matches ORDER BY date DESC NULLS LAST')
  
  const matches = await Promise.all(result.rows.map(async (row) => {
    const participantsResult = await pool.query(
      'SELECT participant_id FROM match_participants WHERE match_id = $1',
      [row.id]
    )
    const participants = participantsResult.rows.map(r => r.participant_id)
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      date: row.date,
      games: row.games,
      participants
    }
  }))
  
  return matches
}

export async function getMatch(id) {
  const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id])
  if (result.rows.length === 0) return null
  
  const row = result.rows[0]
  const participantsResult = await pool.query(
    'SELECT participant_id FROM match_participants WHERE match_id = $1',
    [id]
  )
  const participants = participantsResult.rows.map(r => r.participant_id)
  
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    games: row.games,
    participants
  }
}

export async function addMatch(m) {
  const id = m.id || generateId('m')
  
  await pool.query(
    `INSERT INTO matches (id, title, description, date, games)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      id,
      m.title || null,
      m.description || null,
      m.date || null,
      m.games || 1
    ]
  )
  
  if (m.participants && Array.isArray(m.participants)) {
    for (const participantId of m.participants) {
      await pool.query(
        'INSERT INTO match_participants (match_id, participant_id) VALUES ($1, $2)',
        [id, participantId]
      )
    }
  }
  
  return id
}

export async function updateMatch(id, m) {
  const updates = []
  const values = []
  let paramCount = 1
  
  if (m.title !== undefined) {
    updates.push(`title = $${paramCount++}`)
    values.push(m.title)
  }
  if (m.description !== undefined) {
    updates.push(`description = $${paramCount++}`)
    values.push(m.description)
  }
  if (m.date !== undefined) {
    updates.push(`date = $${paramCount++}`)
    values.push(m.date)
  }
  if (m.games !== undefined) {
    updates.push(`games = $${paramCount++}`)
    values.push(m.games)
  }
  
  if (updates.length > 0) {
    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)
    
    await pool.query(
      `UPDATE matches SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    )
  }
  
  if (m.participants && Array.isArray(m.participants)) {
    await pool.query('DELETE FROM match_participants WHERE match_id = $1', [id])
    for (const participantId of m.participants) {
      await pool.query(
        'INSERT INTO match_participants (match_id, participant_id) VALUES ($1, $2)',
        [id, participantId]
      )
    }
  }
}

export async function removeMatch(id) {
  await pool.query('DELETE FROM matches WHERE id = $1', [id])
}
