export type Papel = 'ADMIN' | 'MEMBER'

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

export interface RespostaLogAuditoria {
  id: number
  acao: string
  tipoEntidade: string
  entidadeId: number | null
  usuarioId: number | null
  detalhe: string | null
  criadoEm: string
}
