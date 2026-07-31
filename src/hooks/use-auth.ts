import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, mensagemDeErro } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import type { RequisicaoLogin, RequisicaoRegistro, RespostaLogin } from '@/types/api'

/**
 * Le a sessao atual. Selectors individuais (nao `useAuthStore()` puro) de
 * proposito - a store tambem guarda refreshToken, que muda toda vez que o
 * interceptor do axios renova o token; sem selector, todo componente que so
 * usa `usuario` re-renderizaria a cada renovacao silenciosa em segundo
 * plano.
 */
export function useAuth() {
  const usuario = useAuthStore((s) => s.usuario)
  const token = useAuthStore((s) => s.token)
  return { usuario, isAuthenticated: Boolean(token) }
}

/**
 * login/registro/logout como mutations (nao funcoes async soltas) pelo
 * mesmo motivo de qualquer outra escrita no app: isPending/isError prontos,
 * e o componente que chama fica livre de try/catch - o feedback (toast) e'
 * responsabilidade do hook, nao de quem usa.
 */
export function useLogin() {
  const navigate = useNavigate()
  const setSessao = useAuthStore((s) => s.setSessao)

  return useMutation({
    mutationFn: (requisicao: RequisicaoLogin) =>
      api.post<RespostaLogin>('/api/auth/login', requisicao).then((r) => r.data),
    onSuccess: (data) => {
      setSessao(data)
      toast.success('Login realizado')
      navigate('/projetos')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Email ou senha incorretos')),
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const setSessao = useAuthStore((s) => s.setSessao)

  return useMutation({
    mutationFn: (requisicao: RequisicaoRegistro) =>
      api.post<RespostaLogin>('/api/auth/registrar', requisicao).then((r) => r.data),
    onSuccess: (data) => {
      setSessao(data)
      toast.success('Conta criada')
      navigate('/projetos')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel criar a conta')),
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const limparSessao = useAuthStore((s) => s.limparSessao)

  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken
      limparSessao()
      navigate('/login')
      if (refreshToken) {
        // sessao local ja foi limpa - se a revogacao no servidor falhar (ex.: rede
        // caiu), o usuario ja esta deslogado aqui, so o token antigo fica valido
        // no servidor ate expirar sozinho
        await api.post('/api/auth/logout', { refreshToken }).catch(() => {})
      }
    },
    onSuccess: () => toast.success('Sessao encerrada'),
  })
}
