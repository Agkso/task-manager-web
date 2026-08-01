import { Badge } from '@/shared/ui/badge'
import type { Prioridade } from '@/features/tarefas/types'

const estilos: Record<Prioridade, string> = {
  LOW: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  HIGH: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

const rotulos: Record<Prioridade, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Critica',
}

export function PriorityBadge({ prioridade }: { prioridade: Prioridade }) {
  return (
    <Badge variant="outline" className={estilos[prioridade]}>
      {rotulos[prioridade]}
    </Badge>
  )
}
