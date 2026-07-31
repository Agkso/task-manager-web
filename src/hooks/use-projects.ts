import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projetosApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { RequisicaoProjeto } from '@/types/api'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projetos,
    queryFn: projetosApi.listar,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: RequisicaoProjeto) => projetosApi.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projetos })
      toast.success('Projeto criado')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel criar o projeto')),
  })
}
