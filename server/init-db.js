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
        age INTEGER,
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
        payment_type VARCHAR(50),
        payment_paid BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create match_participants junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_participants (
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
        participant_id VARCHAR(255) REFERENCES participants(id) ON DELETE CASCADE,
        goals INTEGER DEFAULT 0,
        own_goals INTEGER DEFAULT 0,
        fouls INTEGER DEFAULT 0,
        cards INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Database initialized successfully')
  } catch (err) {
    console.error('Database initialization error:', err)
    throw err
  }
}
