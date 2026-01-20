# Migração para PostgreSQL - Pelada Final

## Alterações Realizadas

### 1. Dependências Adicionadas
- `pg@8.11.3` - Driver PostgreSQL
- `dotenv@16.3.1` - Gerenciamento de variáveis de ambiente

### 2. Arquivos Criados

#### `server/pool.js`
Gerencia a conexão com o banco de dados PostgreSQL usando connection pool.

#### `server/init-db.js`
Inicializa o banco de dados criando as tabelas necessárias:
- `participants` - Tabela de participantes
- `matches` - Tabela de partidas
- `match_organization` - Relação many-to-many entre partidas e participantes
- `match_results` - Resultados das partidas
- `meta` - Metadados (ex: último mês com reset)

#### `.env.example`
Arquivo de exemplo com variáveis de ambiente necessárias.

### 3. Arquivos Modificados

#### `server/db.js`
- Reescrito para usar PostgreSQL em vez de arquivo JSON
- Todas as funções agora são `async`
- Mantém a mesma interface de API

#### `server/index.js`
- Adicionado import de `initDb`
- Chamada de `await initDb()` antes de iniciar o servidor
- Todos os handlers agora são `async`
- Adicionado import de `applyNewResultsToMatch`

#### `package.json`
- Adicionadas dependências `pg` e `dotenv`

## Como Usar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais PostgreSQL
   ```

3. **Certifique-se de que PostgreSQL está rodando:**
   ```bash
   # Windows (se usando PostgreSQL)
   psql -U postgres
   ```

4. **Inicie o servidor:**
   ```bash
   npm run dev:server
   ```

O banco de dados e as tabelas serão criados automaticamente na primeira execução.

## Variáveis de Ambiente

- `DB_USER` - Usuário PostgreSQL (padrão: postgres)
- `DB_PASSWORD` - Senha PostgreSQL (padrão: password)
- `DB_HOST` - Host do PostgreSQL (padrão: localhost)
- `DB_PORT` - Porta do PostgreSQL (padrão: 5432)
- `DB_NAME` - Nome do banco de dados (padrão: pelada)
- `PORT` - Porta do servidor Express (padrão: 4000)

## Estrutura do Banco de Dados

### participants
```sql
id, name, fantasy_name, birth_date, type, position, active, 
offense, defense, speed, goals, own_goals, matches, fouls, cards, created_at
```

### matches
```sql
id, title, description, date, games, created_at
```

### match_organization
```sql
match_id, participant_id (composite key)
```

### match_results
```sql
id, match_id, result_data (JSONB), created_at
```

### meta
```sql
key, value
```
