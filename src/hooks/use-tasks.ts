import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tarefasApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { PaginaResposta, RespostaTarefa, StatusTarefa } from '@/types/api'

// board mostra tudo de uma vez (sem paginar por coluna) - ver decisoes
// tecnicas do frontend pro porque disso ser aceitavel pro tamanho de
// projeto que este app atende
const TAMANHO_BOARD = 100

export function useTasks(projetoId: number) {
  return useQuery({
    queryKey: queryKeys.tarefas(projetoId),
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
  const chave = queryKeys.tarefas(projetoId)

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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chave })
      queryClient.invalidateQueries({ queryKey: queryKeys.relatorio(projetoId) })
    },
  })
}
