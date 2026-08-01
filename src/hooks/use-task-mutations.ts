import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tarefasApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { RequisicaoTarefa } from '@/types/api'

export function useCreateTask(projetoId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: RequisicaoTarefa) => tarefasApi.criar(projetoId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tarefas(projetoId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.relatorio(projetoId) })
      toast.success('Tarefa criada')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel criar a tarefa')),
  })
}

export function useUpdateTask(projetoId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tarefaId, dados }: { tarefaId: number; dados: RequisicaoTarefa }) =>
      tarefasApi.atualizar(projetoId, tarefaId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tarefas(projetoId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.relatorio(projetoId) })
      toast.success('Tarefa atualizada')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel atualizar a tarefa')),
  })
}

export function useDeleteTask(projetoId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tarefaId: number) => tarefasApi.excluir(projetoId, tarefaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tarefas(projetoId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.relatorio(projetoId) })
      toast.success('Tarefa excluida')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel excluir a tarefa')),
  })
}
