# ⚽ Rhema Society - Gerenciador de Partidas

Sistema moderno para gerenciamento de participantes e partidas de futebol, desenvolvido com React + TypeScript + Vite e PostgreSQL.

## 🎯 Funcionalidades

### 1. **Participantes**
- ✅ Cadastro completo com: nome, nome fantasia, nascimento, tipo (Mensalista/Diarista)
- ✅ Posição: Jogador, Goleiro ou Juiz
- ✅ Avaliações com 5 estrelas (Ofensivo, Defensivo, Velocidade)
- ✅ Estatísticas: Faltas, Cartões, Gols, Contras, Partidas participadas
- ✅ Status ativo/inativo
- ✅ Lista em cards ordenada alfabeticamente
- ✅ Busca rápida por nome ou nome fantasia

### 2. **Partidas**
- ✅ Criação com título, descrição, data e quantidade de jogos
- ✅ Listagem em cards
- ✅ Três abas principais: **Organização**, **Times** e **Partida**

#### **Organização**
- Adicionar jogadores por ordem de chegada
- Reorganizar lista (mover para cima/baixo)
- Excluir participantes
- Registro de todas as ações

#### **Times**
- Mistura automática dos times
- Máximo 6 jogadores por time (sem contar juiz/goleiro)
- Cálculo de média de estatísticas (defesa, ofensivo, velocidade)
- Exibição em estrelas da força geral do time

#### **Partida**
- Registro de placar em tempo real
- Exibição da partida em andamento
- Histórico de partidas finalizadas
- Rastreamento de gols, contras, faltas e cartões

### 3. **Administração**
- 📊 Resumo de pagamentos (Mensalistas vs Diaristas)
- ⚠️ Controle de pagamentos com status
- 📥 Exportar dados para CSV
- 🔄 Resetar estatísticas de participantes

## 🚀 Stack Tecnológico

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build tool rápido
- **Bootstrap 5** - Framework CSS
- **React Hooks** - State Management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **PostgreSQL** - Database
- **TypeScript** - Type Safety

### DevTools
- **nodemon** - File watcher
- **concurrently** - Executar múltiplos scripts
- **tsx** - Executar TypeScript direto
- **ESLint** - Code quality

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 12+

## 🔧 Instalação

### 1. Clonar ou entrar no projeto
```bash
cd pelada-final
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Criar arquivo `.env` na raiz:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1!P@ssword#
DB_NAME=pelada
PORT=4000
NODE_ENV=development
```

### 4. Criar banco de dados PostgreSQL
```sql
CREATE DATABASE pelada;
```

### 5. Iniciar o desenvolvimento

**Opção 1: Frontend e Backend separados**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

**Opção 2: Ambos simultaneamente**
```bash
npm run dev:full
```

O frontend rodará em: **http://localhost:5173**
O backend rodará em: **http://localhost:4000**

## 📁 Estrutura do Projeto

```
pelada-final/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ParticipantForm.tsx
│   │   ├── ParticipantCard.tsx
│   │   ├── MatchForm.tsx
│   │   ├── MatchCard.tsx
│   │   └── StarRating.tsx
│   ├── pages/              # Páginas principais
│   │   ├── Participants.tsx
│   │   ├── Matches.tsx
│   │   └── Admin.tsx
│   ├── services/           # API client
│   │   └── api.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx             # Componente raiz
│   ├── App.css             # Estilos da app
│   ├── index.css           # Estilos globais
│   └── main.tsx            # Entry point
├── server/                 # Backend
│   ├── index.ts            # Express app
│   ├── pool.ts             # PostgreSQL connection
│   ├── init-db.ts          # Database initialization
│   └── db.ts               # Database operations
├── public/                 # Assets estáticos
├── index.html              # HTML raiz
├── package.json            # Dependências
├── vite.config.ts          # Vite config
└── .env                    # Variáveis de ambiente
```

## 🎨 Design

### Paleta de Cores
- **Preto Principal**: #0a0a0a
- **Preto Secundário**: #1a1a1a
- **Amarelo Destaque**: #ffc107
- **Cinza Texto**: #666

### Componentes de UI
- Cards com glassmorphism e gradientes
- Botões com hover effects suaves
- Formulários com validação
- Tabelas responsivas
- Badges coloridos
- Spinners de carregamento

## 📊 Schema do Banco de Dados

### Tabelas

**participants**
- id (PK)
- name, fantasy_name
- birth_date
- type (Mensalista/Diarista)
- position (Jogador/Goleiro/Juiz)
- active (boolean)
- offensive_rating, defensive_rating, speed_rating (1-5)
- fouls, cards, goals, own_goals, matches_played
- created_at, updated_at

**matches**
- id (PK)
- title, description
- match_date
- games_count
- status (pending/in_progress/finished)
- created_at, updated_at

**match_participants** (Junction table)
- id (PK)
- match_id (FK)
- participant_id (FK)
- arrival_order
- team (1 ou 2)
- goals, own_goals, fouls, cards

**match_results**
- id (PK)
- match_id (FK)
- game_number
- team1_id, team2_id
- team1_goals, team2_goals
- status
- created_at, updated_at

## 🔌 API Endpoints

### Participantes
- `GET /api/participants` - Listar todos
- `GET /api/participants/:id` - Buscar um
- `POST /api/participants` - Criar novo
- `PUT /api/participants/:id` - Atualizar
- `DELETE /api/participants/:id` - Remover

### Partidas
- `GET /api/matches` - Listar todas
- `GET /api/matches/:id` - Buscar uma
- `POST /api/matches` - Criar nova
- `PUT /api/matches/:id` - Atualizar
- `DELETE /api/matches/:id` - Remover

### Participantes da Partida
- `GET /api/matches/:matchId/participants` - Listar
- `POST /api/matches/:matchId/participants` - Adicionar
- `PUT /api/match-participants/:id` - Atualizar
- `DELETE /api/match-participants/:id` - Remover

### Resultados
- `GET /api/matches/:matchId/results` - Listar
- `PUT /api/match-results/:id` - Atualizar

## 🚀 Deploy

### Frontend (Vercel/Netlift)
```bash
npm run build
```

### Backend (Heroku/Railway)
```bash
npm run start:server
```

## 📝 Scripts Disponíveis

- `npm run dev` - Iniciar Vite dev server
- `npm run dev:server` - Iniciar Express com nodemon
- `npm run dev:full` - Iniciar ambos concorrentemente
- `npm run build` - Build para produção
- `npm run lint` - Executar ESLint
- `npm run preview` - Preview do build

## 🐛 Troubleshooting

### Erro de conexão PostgreSQL
1. Verifique se PostgreSQL está rodando
2. Confirme credenciais no `.env`
3. Certifique-se que o banco `pelada` existe

### Porta 4000 já em uso
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4000
kill -9 <PID>
```

### Porta 5173 já em uso
```bash
npm run dev -- --port 3000
```

## 📞 Suporte

Para dúvidas ou problemas, verifique os logs do console ou crie uma issue.

## 📄 Licença

Projeto privado - Rhema Society 2026

---

**Desenvolvido com ❤️ usando React + TypeScript + PostgreSQL**
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
