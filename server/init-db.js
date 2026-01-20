import pool from './pool.js'

export async function initDb() {
  try {
    // Create participants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        fantasy_name VARCHAR(255),
        birth_date DATE,
        type VARCHAR(50) DEFAULT 'mensalista',
        position VARCHAR(50) DEFAULT 'jogador',
        active BOOLEAN DEFAULT true,
        offense INTEGER DEFAULT 0,
        defense INTEGER DEFAULT 0,
        speed INTEGER DEFAULT 0,
        goals INTEGER DEFAULT 0,
        own_goals INTEGER DEFAULT 0,
        matches INTEGER DEFAULT 0,
        fouls INTEGER DEFAULT 0,
        cards INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create matches table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        date DATE,
        games INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create match_organization table (many-to-many)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_organization (
        match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
        participant_id VARCHAR(255) REFERENCES participants(id) ON DELETE CASCADE,
        PRIMARY KEY (match_id, participant_id)
      )
    `)

    // Create match_results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_results (
        id SERIAL PRIMARY KEY,
        match_id VARCHAR(255) REFERENCES matches(id) ON DELETE CASCADE,
        result_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create meta table for monthly reset tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meta (
        key VARCHAR(255) PRIMARY KEY,
        value VARCHAR(255)
      )
    `)

    console.log('Database initialized successfully')
  } catch (err) {
    console.error('Database initialization error:', err)
    throw err
  }
}
