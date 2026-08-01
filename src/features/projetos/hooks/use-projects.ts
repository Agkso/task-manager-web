import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projetosApi } from '@/features/projetos/api/projetos-api'
import { mensagemDeErro } from '@/shared/lib/api'
import { projetosKeys } from '@/features/projetos/api/query-keys'
import type { RequisicaoProjeto } from '@/features/projetos/types'

export function useProjects() {
  return useQuery({
    queryKey: projetosKeys.projetos,
    queryFn: projetosApi.listar,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: RequisicaoProjeto) => projetosApi.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projetosKeys.projetos })
      toast.success('Projeto criado')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel criar o projeto')),
  })
}
