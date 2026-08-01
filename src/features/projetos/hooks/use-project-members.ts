import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projetosApi } from '@/features/projetos/api/projetos-api'
import { mensagemDeErro } from '@/shared/lib/api'
import { projetosKeys } from '@/features/projetos/api/query-keys'
import type { RequisicaoAdicionarMembro } from '@/features/projetos/types'

export function useProjectMembers(projetoId: number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: projetosKeys.membros(projetoId),
    queryFn: () => projetosApi.listarMembros(projetoId),
    enabled: options.enabled ?? true,
  })
}

export function useAddMember(projetoId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: RequisicaoAdicionarMembro) => projetosApi.adicionarMembro(projetoId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projetosKeys.membros(projetoId) })
      toast.success('Membro adicionado')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel adicionar')),
  })
}

export function useRemoveMember(projetoId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (usuarioId: number) => projetosApi.removerMembro(projetoId, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projetosKeys.membros(projetoId) })
      toast.success('Membro removido')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel remover')),
  })
}
