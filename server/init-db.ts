import pool from './pool';

export async function initializeDatabase() {
  try {
    // Tabela de Participantes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        fantasy_name VARCHAR(255),
        birth_date DATE,
        type VARCHAR(50), -- 'Mensalista' ou 'Diarista'
        position VARCHAR(50), -- 'Jogador', 'Goleiro' ou 'Juiz'
        active BOOLEAN DEFAULT true,
        offensive_rating INT DEFAULT 1, -- 1-5 stars
        defensive_rating INT DEFAULT 1, -- 1-5 stars
        speed_rating INT DEFAULT 1, -- 1-5 stars
        fouls INT DEFAULT 0,
        cards INT DEFAULT 0,
        goals INT DEFAULT 0,
        own_goals INT DEFAULT 0,
        matches_played INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Partidas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        match_date DATE NOT NULL,
        games_count INT DEFAULT 1,
        status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'finished'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Participantes em Partida (relação muitos-para-muitos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_participants (
        id SERIAL PRIMARY KEY,
        match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        participant_id INT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
        arrival_order INT,
        team INT, -- 1 ou 2 para times
        goals INT DEFAULT 0,
        own_goals INT DEFAULT 0,
        fouls INT DEFAULT 0,
        cards INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(match_id, participant_id)
      )
    `);

    // Tabela de Resultados de Partida
    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_results (
        id SERIAL PRIMARY KEY,
        match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        game_number INT NOT NULL,
        team1_id INT REFERENCES participants(id),
        team2_id INT REFERENCES participants(id),
        team1_goals INT DEFAULT 0,
        team2_goals INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'finished'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    throw err;
  }
}
