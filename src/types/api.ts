export type Papel = 'ADMIN' | 'MEMBER'

export type StatusTarefa = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Prioridade = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface RespostaLogin {
  token: string
  tipo: string
  refreshToken: string
}

export interface RequisicaoLogin {
  email: string
  senha: string
}

export interface RequisicaoRegistro {
  nome: string
  email: string
  senha: string
}

export interface RespostaProjeto {
  id: number
  nome: string
  descricao: string | null
  donoId: number
  donoNome: string
  criadoEm: string
  atualizadoEm: string
}

export interface RequisicaoProjeto {
  nome: string
  descricao?: string
}

export interface RespostaMembro {
  usuarioId: number
  nome: string
  email: string
  papel: Papel
}

export interface RequisicaoAdicionarMembro {
  email: string
  papel: Papel
}

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

export interface PaginaResposta<T> {
  conteudo: T[]
  paginaAtual: number
  totalPaginas: number
  totalElementos: number
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

export interface RespostaLogAuditoria {
  id: number
  acao: string
  tipoEntidade: string
  entidadeId: number | null
  usuarioId: number | null
  detalhe: string | null
  criadoEm: string
}

export interface RespostaEventoStatusTarefa {
  tarefaId: number
  statusAnterior: StatusTarefa
  statusNovo: StatusTarefa
}

export interface ProblemDetail {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  erros?: string[]
}
