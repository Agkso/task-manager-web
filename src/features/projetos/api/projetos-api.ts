import { api } from '@/shared/lib/api'
import type { PaginaResposta } from '@/shared/types/api'
import type {
  RequisicaoAdicionarMembro,
  RequisicaoProjeto,
  RespostaLogAuditoria,
  RespostaMembro,
  RespostaProjeto,
} from '@/features/projetos/types'

export const projetosApi = {
  listar: () => api.get<RespostaProjeto[]>('/api/projetos').then((r) => r.data),
  buscar: (id: number) => api.get<RespostaProjeto>(`/api/projetos/${id}`).then((r) => r.data),
  criar: (dados: RequisicaoProjeto) => api.post<RespostaProjeto>('/api/projetos', dados).then((r) => r.data),
  atualizar: (id: number, dados: RequisicaoProjeto) =>
    api.put<RespostaProjeto>(`/api/projetos/${id}`, dados).then((r) => r.data),
  excluir: (id: number) => api.delete(`/api/projetos/${id}`),

  listarMembros: (id: number) => api.get<RespostaMembro[]>(`/api/projetos/${id}/membros`).then((r) => r.data),
  adicionarMembro: (id: number, dados: RequisicaoAdicionarMembro) =>
    api.post<RespostaMembro>(`/api/projetos/${id}/membros`, dados).then((r) => r.data),
  removerMembro: (id: number, usuarioId: number) => api.delete(`/api/projetos/${id}/membros/${usuarioId}`),

  auditoria: (id: number, pagina = 0, tamanho = 20) =>
    api
      .get<PaginaResposta<RespostaLogAuditoria>>(`/api/projetos/${id}/auditoria`, { params: { pagina, tamanho } })
      .then((r) => r.data),
}
