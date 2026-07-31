import { useQuery } from '@tanstack/react-query'
import { tarefasApi } from '@/lib/resources'
import { queryKeys } from '@/lib/query-keys'

export function useTaskHistory(projetoId: number, tarefaId: number | undefined, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.historico(projetoId, tarefaId),
    queryFn: () => tarefasApi.historico(projetoId, tarefaId!),
    enabled: Boolean(tarefaId) && (options.enabled ?? true),
  })
}
