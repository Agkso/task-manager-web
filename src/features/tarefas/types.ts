export type StatusTarefa = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Prioridade = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface RespostaTarefa {
  id: number
  projetoId: number
  titulo: string
  descricao: string | null
  status: StatusTarefa
  prioridade: Prioridade
  prazo: string | null
  responsavelId: number | null
  responsavelNome: string | null
  criadoEm: string
  atualizadoEm: string
}

export interface RequisicaoTarefa {
  titulo: string
  descricao?: string
  prioridade: Prioridade
  prazo?: string
  responsavelId?: number
}

export interface RequisicaoAtualizarStatus {
  status: StatusTarefa
}

export interface FiltroTarefas {
  status?: StatusTarefa
  prioridade?: Prioridade
  responsavelId?: number
  busca?: string
  ordenarPor?: string
  direcao?: 'asc' | 'desc'
  pagina?: number
  tamanho?: number
}

export interface RespostaRelatorio {
  byStatus: Record<StatusTarefa, number>
  byPriority: Record<Prioridade, number>
}

export interface RespostaHistoricoTarefa {
  id: number
  statusAnterior: StatusTarefa
  statusNovo: StatusTarefa
  usuarioNome: string
  alteradoEm: string
}

export interface RespostaEventoStatusTarefa {
  tarefaId: number
  statusAnterior: StatusTarefa
  statusNovo: StatusTarefa
}
