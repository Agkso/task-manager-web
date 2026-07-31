import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from '@/components/board/task-card'
import type { RespostaTarefa, StatusTarefa } from '@/types/api'
import { cn } from '@/lib/utils'

export const COLUNAS: { status: StatusTarefa; titulo: string; corPonto: string }[] = [
  { status: 'TODO', titulo: 'A fazer', corPonto: 'bg-status-todo' },
  { status: 'IN_PROGRESS', titulo: 'Em andamento', corPonto: 'bg-status-progress' },
  { status: 'DONE', titulo: 'Concluido', corPonto: 'bg-status-done' },
]

export function BoardColumn({
  status,
  titulo,
  corPonto,
  tarefas,
  onSelecionarTarefa,
}: {
  status: StatusTarefa
  titulo: string
  corPonto: string
  tarefas: RespostaTarefa[]
  onSelecionarTarefa: (tarefa: RespostaTarefa) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[60vh] w-full flex-col gap-3 rounded-lg border bg-muted/30 p-3 transition-colors',
        isOver && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={cn('h-2 w-2 rounded-full', corPonto)} />
        <h2 className="text-sm font-semibold">{titulo}</h2>
        <span className="ml-auto text-xs text-muted-foreground">{tarefas.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tarefas.map((tarefa) => (
          <TaskCard key={tarefa.id} tarefa={tarefa} onClick={() => onSelecionarTarefa(tarefa)} />
        ))}
        {tarefas.length === 0 && (
          <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
            Arraste uma tarefa pra ca
          </div>
        )}
      </div>
    </div>
  )
}
