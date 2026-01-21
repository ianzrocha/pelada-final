# Setup PostgreSQL

## Configuração do Banco de Dados

Certifique-se de que o PostgreSQL está instalado e rodando.

### Criar o Banco de Dados

Conecte ao PostgreSQL e execute:

```sql
CREATE DATABASE pelada;
```

## Inicializar o Servidor

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor (que criará as tabelas automaticamente):
```bash
npm run start:server
```

Ou para desenvolvimento com hot-reload:
```bash
npm run dev:server
```

## Iniciar Tudo (Frontend + Backend)

```bash
npm run dev:full
```

## Variáveis de Ambiente

Atualize o arquivo `.env`:

```
DB_USER=postgres
DB_PASSWORD=1!P@ssword#
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pelada
PORT=4000
```

## Estrutura do Banco

### Tabela: participants
- `id` - ID único
- `name` - Nome do participante
- `fantasy_name` - Nome fantasia
- `birth_date` - Data de nascimento
- `age` - Idade
- `type` - Tipo (mensalista/eventual)
- `position` - Posição
- `active` - Ativo/Inativo
- `offense` - Ofensivo (1-5)
- `defense` - Defensivo (1-5)
- `speed` - Velocidade (1-5)
- `goals` - Total de gols
- `own_goals` - Gols contra
- `matches` - Total de partidas
- `fouls` - Faltas
- `cards` - Cartões
- `payment_type` - Tipo de pagamento
- `payment_paid` - Pagamento realizado

### Tabela: matches
- `id` - ID único
- `title` - Título
- `description` - Descrição
- `date` - Data
- `games` - Número de jogos

### Tabelas de Relacionamento
- `match_participants` - Participantes por partida
- `match_results` - Resultados das partidas
