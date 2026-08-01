import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { Navbar } from '@/shared/components/navbar'
import { PageHeader } from '@/shared/components/page-header'
import { BoardColumn } from '@/features/board/components/board-column'
import { CreateTaskDialog } from '@/features/board/components/create-task-dialog'
import { TaskDetailDialog } from '@/features/board/components/task-detail-dialog'
import { MembersDialog } from '@/features/projetos/components/members-dialog'
import { AuditLogDialog } from '@/features/projetos/components/audit-log-dialog'
import { ReportDialog } from '@/features/board/components/report-dialog'
import { Skeleton } from '@/shared/ui/skeleton'
import { useProject } from '@/features/projetos/hooks/use-project'
import { useTasks, useMoveTask } from '@/features/board/hooks/use-tasks'
import { useTaskEvents } from '@/features/board/hooks/use-task-events'
import { COLUNAS } from '@/features/board/board-columns'
import type { RespostaTarefa, StatusTarefa } from '@/features/board/types'

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
      <main className="w-full p-6">
        <PageHeader
          title={projeto?.nome ?? 'Carregando...'}
          backTo="/projetos"
          actions={
            <>
              <MembersDialog projetoId={projetoId} />
              <AuditLogDialog projetoId={projetoId} />
              <ReportDialog projetoId={projetoId} />
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
