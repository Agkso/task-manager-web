import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RespostaLogin } from '@/types/api'

interface UsuarioSessao {
  usuarioId: number
  nome: string
  email: string
}

interface AuthState {
  usuario: UsuarioSessao | null
  token: string | null
  refreshToken: string | null
  setSessao: (resposta: RespostaLogin) => void
  limparSessao: () => void
}

/** Decodifica o payload do JWT sem validar assinatura - so pra ler claims (a API e' quem valida de verdade). */
function decodificarUsuario(token: string): UsuarioSessao {
  const payload = JSON.parse(atob(token.split('.')[1])) as {
    usuarioId: number
    nome: string
    sub: string
  }
  return { usuarioId: payload.usuarioId, nome: payload.nome, email: payload.sub }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      refreshToken: null,
      setSessao: (resposta) =>
        set({
          usuario: decodificarUsuario(resposta.token),
          token: resposta.token,
          refreshToken: resposta.refreshToken,
        }),
      limparSessao: () => set({ usuario: null, token: null, refreshToken: null }),
    }),
    { name: 'task-manager-auth' },
  ),
)
