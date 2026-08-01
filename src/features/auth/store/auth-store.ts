import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeJwtPayload } from '@/features/auth/jwt'
import type { RespostaLogin } from '@/features/auth/types'

export interface UsuarioSessao {
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

interface ClaimsToken {
  usuarioId: number
  nome: string
  sub: string
}

/** Le o payload do JWT sem validar assinatura - so pra exibir na UI (a API e' quem valida de verdade). */
function decodificarUsuario(token: string): UsuarioSessao {
  const claims = decodeJwtPayload<ClaimsToken>(token)
  return { usuarioId: claims.usuarioId, nome: claims.nome, email: claims.sub }
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
