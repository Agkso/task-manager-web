# Task Manager Web

Frontend do [task-manager-api](https://github.com/Agkso/task-manager-api) - board de tarefas por projeto, com autenticação, drag-and-drop e atualização em tempo real.

## Stack

- Vite + React 19 + TypeScript
- Tailwind v4 + shadcn/ui
- react-router-dom (rotas)
- axios (cliente HTTP, com refresh automático de token no 401)
- zustand (sessão do usuário, persistida em localStorage)
- @tanstack/react-query (cache/fetch de dados do servidor)
- @dnd-kit (drag-and-drop do board)

## Como rodar

Pré-requisito: o [backend](https://github.com/Agkso/task-manager-api) rodando (local ou a URL de produção).

```bash
cp .env.example .env.local   # ajuste VITE_API_URL se o backend não estiver em localhost:8080
yarn install
yarn dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex.: `http://localhost:8080` local, ou a URL do Railway em produção) |

## Arquitetura

- `src/lib/api.ts` - instância axios com interceptor de `Authorization` e renovação automática de token via refresh token.
- `src/stores/auth-store.ts` + `src/hooks/use-auth.ts` - sessão do usuário (zustand + persist), com uma API parecida com `useSession()`/`signIn()`/`signOut()` do NextAuth (não dá pra usar a lib de verdade aqui - é feita pra Next.js).
- `src/lib/resources.ts` - todas as chamadas HTTP pra API, organizadas por recurso (`projetosApi`, `tarefasApi`).
- `src/hooks/use-task-events.ts` - assina o stream SSE de mudança de status de tarefa e invalida a query do React Query correspondente.
- `src/components/board/` - board (colunas, cards, dialogs de criar/editar tarefa, membros, auditoria).
