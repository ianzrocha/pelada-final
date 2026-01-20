import pool from './pool.js'

function generateId(prefix = 'p') {
  return `${prefix}_` + Math.random().toString(36).slice(2, 9)
}

// PARTICIPANTS

export async function getParticipants() {
  // monthly reset
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  const metaResult = await pool.query('SELECT value FROM meta WHERE key = $1', ['lastResetMonth'])
  const lastResetMonth = metaResult.rows[0]?.value || ''
  
  if (lastResetMonth !== currentMonth) {
    // Reset fouls and cards
    await pool.query('UPDATE participants SET fouls = 0, cards = 0')
    // Update meta
    await pool.query('INSERT INTO meta (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['lastResetMonth', currentMonth])
  }
  
  const result = await pool.query('SELECT * FROM participants ORDER BY name')
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    fantasyName: row.fantasy_name,
    birthDate: row.birth_date,
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
    cards: row.cards
  }))
}

export async function addParticipant(p) {
  const id = p.id || generateId('p')
  
  await pool.query(
    `INSERT INTO participants (id, name, fantasy_name, birth_date, type, position, active, offense, defense, speed, goals, own_goals, matches, fouls, cards)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      id,
      p.name || '',
      p.fantasyName || '',
      p.birthDate || null,
      p.type || 'mensalista',
      p.position || 'jogador',
      p.active !== undefined ? !!p.active : true,
      p.offense || 0,
      p.defense || 0,
      p.speed || 0,
      p.goals || 0,
      p.ownGoals || 0,
      p.matches || 0,
      p.fouls || 0,
      p.cards || 0
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
  
  if (updates.length === 0) return
  
  values.push(id)
  const query = `UPDATE participants SET ${updates.join(', ')} WHERE id = $${paramCount}`
  
  await pool.query(query, values)
}

export async function removeParticipant(id) {
  await pool.query('DELETE FROM participants WHERE id = $1', [id])
}

// MATCHES

export async function getMatches() {
  const result = await pool.query('SELECT * FROM matches ORDER BY date DESC NULLS LAST')
  
  const matches = await Promise.all(result.rows.map(async (row) => {
    // Get organization
    const orgResult = await pool.query(
      'SELECT participant_id FROM match_organization WHERE match_id = $1',
      [row.id]
    )
    const organization = orgResult.rows.map(r => r.participant_id)
    
    // Get results
    const resultsResult = await pool.query(
      'SELECT result_data FROM match_results WHERE match_id = $1 ORDER BY created_at',
      [row.id]
    )
    const results = resultsResult.rows.map(r => r.result_data)
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      date: row.date,
      games: row.games,
      organization,
      results
    }
  }))
  
  return matches
}

export async function getMatch(id) {
  const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id])
  
  if (result.rows.length === 0) return null
  
  const row = result.rows[0]
  
  // Get organization
  const orgResult = await pool.query(
    'SELECT participant_id FROM match_organization WHERE match_id = $1',
    [row.id]
  )
  const organization = orgResult.rows.map(r => r.participant_id)
  
  // Get results
  const resultsResult = await pool.query(
    'SELECT result_data FROM match_results WHERE match_id = $1 ORDER BY created_at',
    [row.id]
  )
  const results = resultsResult.rows.map(r => r.result_data)
  
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    games: row.games,
    organization,
    results
  }
}

export async function addMatch(m) {
  const id = m.id || generateId('m')
  
  await pool.query(
    'INSERT INTO matches (id, title, description, date, games) VALUES ($1, $2, $3, $4, $5)',
    [id, m.title || '', m.description || '', m.date || null, m.games || 1]
  )
  
  // Add organization participants
  if (m.organization && m.organization.length > 0) {
    for (const participantId of m.organization) {
      await pool.query(
        'INSERT INTO match_organization (match_id, participant_id) VALUES ($1, $2)',
        [id, participantId]
      )
    }
  }
  
  // Add results
  if (m.results && m.results.length > 0) {
    for (const result of m.results) {
      await pool.query(
        'INSERT INTO match_results (match_id, result_data) VALUES ($1, $2)',
        [id, JSON.stringify(result)]
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
    values.push(id)
    const query = `UPDATE matches SET ${updates.join(', ')} WHERE id = $${paramCount}`
    await pool.query(query, values)
  }
  
  // Update organization if provided
  if (m.organization !== undefined) {
    await pool.query('DELETE FROM match_organization WHERE match_id = $1', [id])
    if (m.organization.length > 0) {
      for (const participantId of m.organization) {
        await pool.query(
          'INSERT INTO match_organization (match_id, participant_id) VALUES ($1, $2)',
          [id, participantId]
        )
      }
    }
  }
  
  // Update results if provided
  if (m.results !== undefined) {
    await pool.query('DELETE FROM match_results WHERE match_id = $1', [id])
    if (m.results.length > 0) {
      for (const result of m.results) {
        await pool.query(
          'INSERT INTO match_results (match_id, result_data) VALUES ($1, $2)',
          [id, JSON.stringify(result)]
        )
      }
    }
  }
}

export async function removeMatch(id) {
  await pool.query('DELETE FROM matches WHERE id = $1', [id])
}

export async function applyNewResultsToMatch(id, newResults) {
  const match = await getMatch(id)
  if (!match) return
  
  const prev = match.results || []
  const startIndex = prev.length
  const appended = (newResults || []).slice(startIndex)
  if (appended.length === 0) return
  
  // If first time results added, increment matches for all participants in organization
  if (prev.length === 0 && match.organization && match.organization.length) {
    for (const pid of match.organization) {
      await pool.query('UPDATE participants SET matches = matches + 1 WHERE id = $1', [pid])
    }
  }
  
  // Increment goals per scorer
  for (const result of appended) {
    const scorers = result.scorers || []
    for (const s of scorers) {
      if (s.playerId && s.goals && s.goals > 0) {
        await pool.query(
          'UPDATE participants SET goals = goals + $1 WHERE id = $2',
          [s.goals, s.playerId]
        )
      }
    }
  }
  
  // Insert new results
  for (const result of appended) {
    await pool.query(
      'INSERT INTO match_results (match_id, result_data) VALUES ($1, $2)',
      [id, JSON.stringify(result)]
    )
  }
}

export default pool
