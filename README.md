# Pelada — Sistema de Organização de Futebol (Fase 1)

Este repositório contém a base do sistema para organizar peladas: cadastro de participantes, gerenciamento de partidas, ordem de chegada, montagem automática de times e registro de resultados.

Stack
- Frontend: React + Vite + JSX + Bootstrap
- Backend (opcional): Express + armazenamento em arquivo JSON (desenvolvimento)

Como rodar localmente

1. Instale dependências na raiz do projeto:

```bash
npm install
```

2. Rodar frontend e backend em paralelo:

```bash
npm run dev:full
```

3. Ou rodar apenas o servidor:

```bash
npm run start:server
```

Endpoints principais (server)
- `GET /api/participants` — lista participantes
- `POST /api/participants` — cria participante
- `PUT /api/participants/:id` — atualiza participante
- `GET /api/matches` — lista partidas
- `POST /api/matches` — cria partida
- `PUT /api/matches/:id` — atualiza partida (incluindo `results`)

Funcionalidades implementadas
- Cadastro de participantes com atributos técnicos (estrelas)
- Armazenamento local (localStorage) e integração com API quando disponível
- Criação de partidas e organização por ordem de chegada
- Montagem automática de times (até 6 por time), excluindo `juiz` e tratando `goleiro` separadamente
- Registro de resultados por jogo com atribuição de gols a jogadores
- Atualização automática de estatísticas de participantes (incrementa `matches` e `goals` quando resultados são adicionados)

Próximos passos sugeridos
- Melhorar tratamento de edições de resultados (atualização segura, diff completo)
- Implementar atribuição de gols contra (ownGoals), cartões e faltas por jogador
- Adicionar autenticação e papéis administrativos
- Melhorar validações e mensagens de erro no frontend

Design
- Tema escuro com destaque em amarelo (`#f6c84c`) e preto.

Observações
- `server/data.json` será criado automaticamente na primeira execução do servidor.
- Se `npm install` falhar por causa de módulos nativos (ex.: `better-sqlite3`), instale as Build Tools do Visual Studio (opção alternativa: usamos armazenamento em arquivo JSON como atualmente).

