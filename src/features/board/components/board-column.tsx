import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from '@/features/tarefas/components/task-card'
import type { RespostaTarefa, StatusTarefa } from '@/features/tarefas/types'
import { cn } from '@/shared/lib/utils'

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
        // min-h grande so a partir do sm: e' quando as 3 colunas ficam lado a
        // lado (sm:grid-cols-3 no board-page) e faz sentido ter todas com a
        // mesma altura alta pra area de drop - empilhadas (mobile, 1 coluna
        // por vez) isso sobrava como espaco vazio gigante embaixo de 1-2 cards
        'flex min-h-32 w-full flex-col gap-3 rounded-lg border bg-muted/30 p-3 transition-colors sm:min-h-[60vh]',
        isOver && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={cn('h-2 w-2 rounded-full', corPonto)} />
        <h2 className="text-base font-semibold">{titulo}</h2>
        <span className="ml-auto text-sm text-muted-foreground">{tarefas.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tarefas.map((tarefa) => (
          <TaskCard key={tarefa.id} tarefa={tarefa} onClick={() => onSelecionarTarefa(tarefa)} />
        ))}
        {tarefas.length === 0 && (
          <div className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
            Arraste uma tarefa pra ca
          </div>
        )}
      </div>
    </div>
  )
}
