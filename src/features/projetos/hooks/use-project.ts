import { useQuery } from '@tanstack/react-query'
import { projetosApi } from '@/features/projetos/api/projetos-api'
import { projetosKeys } from '@/features/projetos/api/query-keys'

export function useProject(projetoId: number) {
  return useQuery({
    queryKey: projetosKeys.projeto(projetoId),
    queryFn: () => projetosApi.buscar(projetoId),
  })
}
