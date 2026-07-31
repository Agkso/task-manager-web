import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import type { RequisicaoLogin, RequisicaoRegistro, RespostaLogin } from '@/types/api'

/**
 * Equivalente caseiro ao useSession()/signIn()/signOut() do NextAuth - nao
 * da pra usar a lib de verdade aqui (e' feita pra Next.js, depende de API
 * routes/middleware que nao existem num SPA Vite). Mesma ergonomia, apoiada
 * na store de auth (Zustand + persist) em vez de sessao de servidor.
 */
export function useAuth() {
  const navigate = useNavigate()
  const { usuario, token, setSessao, limparSessao } = useAuthStore()

  async function login(requisicao: RequisicaoLogin) {
    const { data } = await api.post<RespostaLogin>('/api/auth/login', requisicao)
    setSessao(data)
    navigate('/projetos')
  }

  async function registrar(requisicao: RequisicaoRegistro) {
    const { data } = await api.post<RespostaLogin>('/api/auth/registrar', requisicao)
    setSessao(data)
    navigate('/projetos')
  }

  async function logout() {
    const refreshToken = useAuthStore.getState().refreshToken
    limparSessao()
    navigate('/login')
    if (refreshToken) {
      await api.post('/api/auth/logout', { refreshToken }).catch(() => {
        // sessao local ja foi limpa - se a revogacao no servidor falhar (ex.: rede
        // caiu), o usuario ja esta deslogado aqui, so o token antigo fica valido
        // no servidor ate expirar sozinho
      })
    }
  }

  return {
    usuario,
    isAuthenticated: Boolean(token),
    login,
    registrar,
    logout,
  }
}
