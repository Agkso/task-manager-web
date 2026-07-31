import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Navbar } from '@/components/layout/navbar'
import { PageHeader } from '@/components/common/page-header'
import { BoardColumn, COLUNAS } from '@/components/board/board-column'
import { CreateTaskDialog } from '@/components/board/create-task-dialog'
import { TaskDetailDialog } from '@/components/board/task-detail-dialog'
import { MembersDialog } from '@/components/board/members-dialog'
import { AuditLogDialog } from '@/components/board/audit-log-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { projetosApi, tarefasApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import { useTaskEvents } from '@/hooks/use-task-events'
import type { PaginaResposta, RespostaTarefa, StatusTarefa } from '@/types/api'

export function BoardPage() {
  const { projetoId: projetoIdParam } = useParams<{ projetoId: string }>()
  const projetoId = Number(projetoIdParam)
  const queryClient = useQueryClient()
  const [tarefaSelecionada, setTarefaSelecionada] = useState<RespostaTarefa | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const { data: projeto } = useQuery({
    queryKey: ['projeto', projetoId],
    queryFn: () => projetosApi.buscar(projetoId),
  })

  const { data: pagina, isLoading } = useQuery({
    queryKey: ['tarefas', projetoId],
    queryFn: () => tarefasApi.listar(projetoId, { tamanho: 100 }),
  })

  useTaskEvents(projetoId)

  const { mutate: mudarStatus } = useMutation({
    mutationFn: ({ tarefaId, status }: { tarefaId: number; status: StatusTarefa }) =>
      tarefasApi.mudarStatus(projetoId, tarefaId, { status }),
    onMutate: async ({ tarefaId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tarefas', projetoId] })
      const anterior = queryClient.getQueryData<PaginaResposta<RespostaTarefa>>(['tarefas', projetoId])
      if (anterior) {
        queryClient.setQueryData<PaginaResposta<RespostaTarefa>>(['tarefas', projetoId], {
          ...anterior,
          conteudo: anterior.conteudo.map((t) => (t.id === tarefaId ? { ...t, status } : t)),
        })
      }
      return { anterior }
    },
    onError: (erro, _vars, contexto) => {
      if (contexto?.anterior) {
        queryClient.setQueryData(['tarefas', projetoId], contexto.anterior)
      }
      toast.error(mensagemDeErro(erro, 'Nao foi possivel mover a tarefa'))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tarefas', projetoId] }),
  })

  function aoTerminarArrastar(evento: DragEndEvent) {
    const { active, over } = evento
    if (!over) return
    const novoStatus = over.id as StatusTarefa
    const tarefa = pagina?.conteudo.find((t) => t.id === active.id)
    if (tarefa && tarefa.status !== novoStatus) {
      mudarStatus({ tarefaId: tarefa.id, status: novoStatus })
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
