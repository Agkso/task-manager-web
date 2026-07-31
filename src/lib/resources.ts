import { api } from '@/lib/api'
import type {
  FiltroTarefas,
  PaginaResposta,
  RequisicaoAdicionarMembro,
  RequisicaoAtualizarStatus,
  RequisicaoProjeto,
  RequisicaoTarefa,
  RespostaHistoricoTarefa,
  RespostaLogAuditoria,
  RespostaMembro,
  RespostaProjeto,
  RespostaRelatorio,
  RespostaTarefa,
} from '@/types/api'

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

export const tarefasApi = {
  listar: (projetoId: number, filtro: FiltroTarefas = {}) =>
    api
      .get<PaginaResposta<RespostaTarefa>>(`/api/projetos/${projetoId}/tarefas`, { params: filtro })
      .then((r) => r.data),
  buscar: (projetoId: number, tarefaId: number) =>
    api.get<RespostaTarefa>(`/api/projetos/${projetoId}/tarefas/${tarefaId}`).then((r) => r.data),
  criar: (projetoId: number, dados: RequisicaoTarefa) =>
    api.post<RespostaTarefa>(`/api/projetos/${projetoId}/tarefas`, dados).then((r) => r.data),
  atualizar: (projetoId: number, tarefaId: number, dados: RequisicaoTarefa) =>
    api.put<RespostaTarefa>(`/api/projetos/${projetoId}/tarefas/${tarefaId}`, dados).then((r) => r.data),
  mudarStatus: (projetoId: number, tarefaId: number, dados: RequisicaoAtualizarStatus) =>
    api.patch<RespostaTarefa>(`/api/projetos/${projetoId}/tarefas/${tarefaId}/status`, dados).then((r) => r.data),
  excluir: (projetoId: number, tarefaId: number) => api.delete(`/api/projetos/${projetoId}/tarefas/${tarefaId}`),
  historico: (projetoId: number, tarefaId: number) =>
    api
      .get<RespostaHistoricoTarefa[]>(`/api/projetos/${projetoId}/tarefas/${tarefaId}/historico`)
      .then((r) => r.data),
  relatorio: (projetoId: number) =>
    api.get<RespostaRelatorio>(`/api/projetos/${projetoId}/tarefas/relatorio`).then((r) => r.data),
}
