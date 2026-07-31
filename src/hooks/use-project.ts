import { useQuery } from '@tanstack/react-query'
import { projetosApi } from '@/lib/resources'
import { queryKeys } from '@/lib/query-keys'

export function useProject(projetoId: number) {
  return useQuery({
    queryKey: queryKeys.projeto(projetoId),
    queryFn: () => projetosApi.buscar(projetoId),
  })
}
