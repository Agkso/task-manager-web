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
npm install
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex.: `http://localhost:8080` local, ou a URL do Railway em produção) |

## Arquitetura

Organização **por feature/domínio**, não por tipo de arquivo - `hooks/`, `lib/` e `components/` genéricos misturando auth+projetos+tarefas no mesmo balaio escondiam onde cada coisa realmente pertence e viravam gaveta de miscelânea. Cada feature é dona dos seus próprios componentes, hooks, API calls, query keys e tipos:

```
src/
  app/               bootstrap (main.tsx, App.tsx/rotas, index.css)
  features/
    auth/            login, registro, esqueci/redefinir senha, sessão (zustand + persist), decode de JWT
    projetos/        listagem/CRUD de projeto, membros, auditoria
    board/           so o shell do kanban (board-page, colunas, drag-and-drop)
    tarefas/         tudo sobre a tarefa em si: dialogs de criar/editar/detalhe,
                     card, badge de prioridade, relatório, eventos SSE
  shared/
    ui/              componentes shadcn (Button, Dialog, Select, ...) - não editados a mão
    components/      Logo, Navbar, PageHeader, DatePicker, EmptyState, SelectField
    lib/             axios (api.ts), query-client, cn()/utils
    types/           só o que é realmente cross-feature (PaginaResposta<T>, ProblemDetail)
```

`board` e `tarefas` são features separadas de propósito: `board` é só o layout/mecânica do kanban (colunas, dnd), enquanto tudo que é sobre a entidade tarefa (CRUD, status, prioridade, histórico, relatório) mora em `tarefas` - `board` importa de `tarefas` pra renderizar (ex.: `useTasks`, `TaskCard`), não o contrário.

Dentro de cada feature: `components/` (UI), `hooks/` (dados/mutations), `api/` (chamadas HTTP + query keys daquele domínio), `tests/` (todo `*.test.*` da feature, separado do código fonte) e `types.ts`/`options.ts` na raiz da feature quando não justificam uma subpasta.

- `src/shared/lib/api.ts` - instância axios com interceptor de `Authorization` e renovação automática de token via refresh token.
- `src/features/auth/store/auth-store.ts` + `src/features/auth/hooks/use-auth.ts` - sessão do usuário (zustand + persist), com uma API parecida com `useSession()`/`signIn()`/`signOut()` do NextAuth (não dá pra usar a lib de verdade aqui - é feita pra Next.js).
- `src/features/projetos/api/projetos-api.ts` e `src/features/tarefas/api/tarefas-api.ts` - chamadas HTTP por domínio (cada um já era um recurso de API separado no backend).
- `src/features/tarefas/hooks/use-task-events.ts` - assina o stream SSE de mudança de status de tarefa e invalida a query do React Query correspondente.
- `src/features/tarefas/components/` - card, badge de prioridade, dialogs de criar/editar/detalhe de tarefa, relatório.
- `src/features/board/components/` - board-page e board-column (o shell do kanban).

## Cache e invalidação (listagem de tarefas e relatório)

O cache de dados do servidor é todo via `@tanstack/react-query` (`src/shared/lib/query-client.ts`), com uma estratégia deliberadamente **baseada em invalidação por evento**, não em polling nem em `staleTime` curto:

- **`staleTime` global de 30s** (`query-client.ts`) é só uma rede de segurança contra refetch redundante (ex.: trocar de aba e voltar) - não é o mecanismo que garante dado atualizado.
- **Mutations invalidam explicitamente as queries que elas afetam.** Criar/atualizar/excluir/mover tarefa invalida `tarefasKeys.tarefas(projetoId)` e `tarefasKeys.relatorio(projetoId)` juntos (`use-task-mutations.ts`, `use-tasks.ts`) - o relatório é uma agregação da mesma tabela de tarefas, então qualquer escrita que muda a listagem também pode mudar as contagens por status/prioridade.
- **SSE (`use-task-events.ts`) invalida as mesmas duas queries quando outro usuário muda o status de uma tarefa** - o board (e o relatório) refletem a mudança de outra pessoa sem precisar de polling. Essa é a peça que justifica não usar um `staleTime` curto por padrão: se a única fonte de "fresh" fosse tempo, ou o app faria polling constante (custo de rede/servidor) ou mostraria dado velho até o próximo refetch manual.
- **`useProjectReport` usa `staleTime` de 60s**, maior que o global, porque o relatório é uma agregação mais cara de recalcular no backend que uma listagem simples - mas isso só evita refetch redundante se o dialog for aberto/fechado repetidamente sem nada ter mudado; a consistência de verdade continua vindo da invalidação explícita acima, não do tempo.

Resumindo a escolha: **invalidação orientada a evento (mutation local + push do servidor) em vez de tempo (polling/staleTime curto)**, porque o board é colaborativo (múltiplos usuários no mesmo projeto) e o custo de ficar reconsultando em intervalo fixo é maior que o de invalidar sob demanda quando algo de fato muda.

## Testes

```bash
npm test              # testes de unidade/componente (vitest + testing-library)
npm run test:watch    # idem, em modo watch
npm run test:e2e      # E2E (playwright) - sobe o dev server sozinho via webServer
```

- `src/features/auth/tests/jwt.test.ts` - decodificação do payload do JWT (unidade), incluindo o caso de base64url com acentuação que causava o bug de "login nunca avança pra home".
- `src/features/projetos/tests/project-card.test.tsx`, `src/features/auth/tests/login-page.test.tsx`, `src/features/tarefas/tests/use-tasks.test.tsx` - testes de componente/hook. Cada feature tem sua própria pasta `tests/`.
- `e2e/login.spec.ts` - fluxo crítico de login → sessão → redirecionamento → listagem de projetos, com a API mockada via `page.route` (sem depender do backend real subir no ambiente de E2E).
