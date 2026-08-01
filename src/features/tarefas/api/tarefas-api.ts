import { api } from '@/shared/lib/api'
import type { PaginaResposta } from '@/shared/types/api'
import type {
  FiltroTarefas,
  RequisicaoAtualizarStatus,
  RequisicaoTarefa,
  RespostaHistoricoTarefa,
  RespostaRelatorio,
  RespostaTarefa,
} from '@/features/tarefas/types'

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
