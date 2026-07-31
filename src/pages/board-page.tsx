import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { Navbar } from '@/components/layout/navbar'
import { PageHeader } from '@/components/common/page-header'
import { BoardColumn, COLUNAS } from '@/components/board/board-column'
import { CreateTaskDialog } from '@/components/board/create-task-dialog'
import { TaskDetailDialog } from '@/components/board/task-detail-dialog'
import { MembersDialog } from '@/components/board/members-dialog'
import { AuditLogDialog } from '@/components/board/audit-log-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject } from '@/hooks/use-project'
import { useTasks, useMoveTask } from '@/hooks/use-tasks'
import { useTaskEvents } from '@/hooks/use-task-events'
import type { RespostaTarefa, StatusTarefa } from '@/types/api'

export function BoardPage() {
  const { projetoId: projetoIdParam } = useParams<{ projetoId: string }>()
  const projetoId = Number(projetoIdParam)
  const [tarefaSelecionada, setTarefaSelecionada] = useState<RespostaTarefa | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const { data: projeto } = useProject(projetoId)
  const { data: pagina, isLoading } = useTasks(projetoId)
  const { mutate: moverTarefa } = useMoveTask(projetoId)

  useTaskEvents(projetoId)

  function aoTerminarArrastar(evento: DragEndEvent) {
    const { active, over } = evento
    if (!over) return
    const novoStatus = over.id as StatusTarefa
    const tarefa = pagina?.conteudo.find((t) => t.id === active.id)
    if (tarefa && tarefa.status !== novoStatus) {
      moverTarefa({ tarefaId: tarefa.id, status: novoStatus })
    }
  }

  return (
    <div className="min-h-svh">
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <PageHeader
          title={projeto?.nome ?? 'Carregando...'}
          backTo="/projetos"
          actions={
            <>
              <MembersDialog projetoId={projetoId} />
              <AuditLogDialog projetoId={projetoId} />
              <CreateTaskDialog projetoId={projetoId} />
            </>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {COLUNAS.map((coluna) => (
              <Skeleton key={coluna.status} className="h-96 rounded-lg" />
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={aoTerminarArrastar}>
            <div className="grid gap-4 sm:grid-cols-3">
              {COLUNAS.map((coluna) => (
                <BoardColumn
                  key={coluna.status}
                  status={coluna.status}
                  titulo={coluna.titulo}
                  corPonto={coluna.corPonto}
                  tarefas={pagina?.conteudo.filter((t) => t.status === coluna.status) ?? []}
                  onSelecionarTarefa={setTarefaSelecionada}
                />
              ))}
            </div>
          </DndContext>
        )}
      </main>

      <TaskDetailDialog
        projetoId={projetoId}
        tarefa={tarefaSelecionada}
        onOpenChange={(aberto) => !aberto && setTarefaSelecionada(null)}
      />
    </div>
  )
}
