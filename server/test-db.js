import pool from './pool.js'

async function testConnection() {
  try {
    console.log('🧪 Testando conexão com PostgreSQL...')
    
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Conexão OK!')
    console.log('Hora do servidor:', result.rows[0].now)
    
    // Testar criação de tabelas
    console.log('\n📋 Criando/Verificando tabelas...')
    
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
    console.log('✅ Tabela participants OK!')
    
    // Testar INSERT
    console.log('\n📝 Testando INSERT...')
    const testId = 'test_' + Date.now()
    
    await pool.query(
      `INSERT INTO participants (id, name, fantasy_name) VALUES ($1, $2, $3)`,
      [testId, 'Teste Jogador', 'Nickname']
    )
    console.log('✅ INSERT OK!')
    
    // Testar SELECT
    console.log('\n📖 Testando SELECT...')
    const selectResult = await pool.query('SELECT * FROM participants WHERE id = $1', [testId])
    console.log('✅ SELECT OK!')
    console.log('Dados:', selectResult.rows[0])
    
    // Deletar teste
    console.log('\n🗑️ Limpando teste...')
    await pool.query('DELETE FROM participants WHERE id = $1', [testId])
    console.log('✅ DELETE OK!')
    
    console.log('\n🎉 TUDO FUNCIONANDO!')
    
    await pool.end()
    process.exit(0)
    
  } catch (err) {
    console.error('❌ ERRO:', err.message)
    console.error('Detalhes:', err)
    process.exit(1)
  }
}

testConnection()
