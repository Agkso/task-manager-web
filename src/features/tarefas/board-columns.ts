import type { StatusTarefa } from '@/features/tarefas/types'

export const COLUNAS: { status: StatusTarefa; titulo: string; corPonto: string }[] = [
  { status: 'TODO', titulo: 'A fazer', corPonto: 'bg-status-todo' },
  { status: 'IN_PROGRESS', titulo: 'Em andamento', corPonto: 'bg-status-progress' },
  { status: 'DONE', titulo: 'Concluido', corPonto: 'bg-status-done' },
]
