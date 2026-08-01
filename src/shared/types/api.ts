export interface PaginaResposta<T> {
  conteudo: T[]
  paginaAtual: number
  totalPaginas: number
  totalElementos: number
}

export interface ProblemDetail {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  erros?: string[]
}
