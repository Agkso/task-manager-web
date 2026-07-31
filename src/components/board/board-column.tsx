import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from '@/components/board/task-card'
import type { RespostaTarefa, StatusTarefa } from '@/types/api'
import { cn } from '@/lib/utils'

export const COLUNAS: { status: StatusTarefa; titulo: string }[] = [
  { status: 'TODO', titulo: 'A fazer' },
  { status: 'IN_PROGRESS', titulo: 'Em andamento' },
  { status: 'DONE', titulo: 'Concluido' },
]

export function BoardColumn({
  status,
  titulo,
  tarefas,
  onSelecionarTarefa,
}: {
  status: StatusTarefa
  titulo: string
  tarefas: RespostaTarefa[]
  onSelecionarTarefa: (tarefa: RespostaTarefa) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[60vh] w-full flex-col gap-3 rounded-lg border bg-muted/30 p-3 transition-colors',
        isOver && 'border-foreground/40 bg-muted/60',
      )}
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">{titulo}</h2>
        <span className="text-xs text-muted-foreground">{tarefas.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tarefas.map((tarefa) => (
          <TaskCard key={tarefa.id} tarefa={tarefa} onClick={() => onSelecionarTarefa(tarefa)} />
        ))}
      </div>
    </div>
  )
}
