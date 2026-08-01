import { useQuery } from '@tanstack/react-query'
import { tarefasApi } from '@/features/board/api/tarefas-api'
import { tarefasKeys } from '@/features/board/api/query-keys'

export function useTaskHistory(projetoId: number, tarefaId: number | undefined, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: tarefasKeys.historico(projetoId, tarefaId),
    queryFn: () => tarefasApi.historico(projetoId, tarefaId!),
    enabled: Boolean(tarefaId) && (options.enabled ?? true),
  })
}
