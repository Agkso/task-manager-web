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

export interface RequisicaoEsqueciSenha {
  email: string
}

export interface RequisicaoRedefinirSenha {
  token: string
  novaSenha: string
}
