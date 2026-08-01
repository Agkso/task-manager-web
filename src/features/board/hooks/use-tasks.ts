import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tarefasApi } from '@/features/board/api/tarefas-api'
import { mensagemDeErro } from '@/shared/lib/api'
import { tarefasKeys } from '@/features/board/api/query-keys'
import { COLUNAS } from '@/features/board/board-columns'
import type { PaginaResposta } from '@/shared/types/api'
import type { RespostaTarefa, StatusTarefa } from '@/features/board/types'

// board mostra tudo de uma vez (sem paginar por coluna) - ver decisoes
// tecnicas do frontend pro porque disso ser aceitavel pro tamanho de
// projeto que este app atende
const TAMANHO_BOARD = 100

export function useTasks(projetoId: number) {
  return useQuery({
    queryKey: tarefasKeys.tarefas(projetoId),
    queryFn: () => tarefasApi.listar(projetoId, { tamanho: TAMANHO_BOARD }),
  })
}

/**
 * Mutation isolada do drag-and-drop: atualiza a query localmente antes da
 * resposta do servidor (onMutate) pra o card mover na hora, e desfaz
 * (onError) se o backend rejeitar - ex.: regra de WIP ou CRITICAL so por
 * ADMIN. As demais mutations de tarefa nao precisam disso porque acontecem
 * dentro de um dialog (o usuario ja espera um delay ali).
 */
export function useMoveTask(projetoId: number) {
  const queryClient = useQueryClient()
  const chave = tarefasKeys.tarefas(projetoId)

  return useMutation({
    mutationFn: ({ tarefaId, status }: { tarefaId: number; status: StatusTarefa }) =>
      tarefasApi.mudarStatus(projetoId, tarefaId, { status }),
    onMutate: async ({ tarefaId, status }) => {
      await queryClient.cancelQueries({ queryKey: chave })
      const anterior = queryClient.getQueryData<PaginaResposta<RespostaTarefa>>(chave)
      if (anterior) {
        queryClient.setQueryData<PaginaResposta<RespostaTarefa>>(chave, {
          ...anterior,
          conteudo: anterior.conteudo.map((t) => (t.id === tarefaId ? { ...t, status } : t)),
        })
      }
      return { anterior }
    },
    onError: (erro, _vars, contexto) => {
      if (contexto?.anterior) {
        queryClient.setQueryData(chave, contexto.anterior)
      }
      toast.error(mensagemDeErro(erro, 'Nao foi possivel mover a tarefa'))
    },
    // onMutate ja moveu o card na hora (drag-and-drop tem que parecer
    // instantaneo) - o toast so aqui, depois do servidor confirmar de
    // verdade, e' o que da a certeza de que salvou (nao so que a UI mudou).
    onSuccess: (_tarefaAtualizada, { status }) => {
      const coluna = COLUNAS.find((c) => c.status === status)
      toast.success(`Tarefa movida para "${coluna?.titulo ?? status}"`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chave })
      queryClient.invalidateQueries({ queryKey: tarefasKeys.relatorio(projetoId) })
    },
  })
}
