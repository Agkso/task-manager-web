import { useQuery } from '@tanstack/react-query'
import { projetosApi } from '@/features/projetos/api/projetos-api'
import { projetosKeys } from '@/features/projetos/api/query-keys'

export function useProjectAudit(projetoId: number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: projetosKeys.auditoria(projetoId),
    queryFn: () => projetosApi.auditoria(projetoId),
    enabled: options.enabled ?? true,
  })
}
