import { useQuery } from '@tanstack/react-query'
import { projetosApi } from '@/lib/resources'
import { queryKeys } from '@/lib/query-keys'

export function useProjectAudit(projetoId: number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.auditoria(projetoId),
    queryFn: () => projetosApi.auditoria(projetoId),
    enabled: options.enabled ?? true,
  })
}
