import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import type { RespostaLogin } from '@/types/api'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const api = axios.create({ baseURL })

// instancia separada sem interceptor, so pra chamada de refresh - evita loop
// infinito se o proprio /auth/refresh devolver 401
const refreshClient = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshEmAndamento: Promise<string> | null = null

async function renovarToken(): Promise<string> {
  const { refreshToken, setSessao, limparSessao } = useAuthStore.getState()
  if (!refreshToken) {
    limparSessao()
    throw new Error('sem refresh token')
  }

  try {
    const { data } = await refreshClient.post<RespostaLogin>('/api/auth/refresh', { refreshToken })
    setSessao(data)
    return data.token
  } catch (erro) {
    limparSessao()
    throw erro
  }
}

interface RequisicaoComRetry extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro: AxiosError) => {
    const config = erro.config as RequisicaoComRetry | undefined

    if (erro.response?.status !== 401 || !config || config._retry) {
      return Promise.reject(erro)
    }
    config._retry = true

    try {
      // varias requisicoes podem cair em 401 ao mesmo tempo (ex.: board fazendo
      // fetch de tarefas + membros juntos) - so a primeira dispara o refresh,
      // as outras esperam a mesma promise em vez de renovar em paralelo
      refreshEmAndamento ??= renovarToken().finally(() => {
        refreshEmAndamento = null
      })
      const novoToken = await refreshEmAndamento
      config.headers.Authorization = `Bearer ${novoToken}`
      return api(config)
    } catch {
      window.location.href = '/login'
      return Promise.reject(erro)
    }
  },
)

export function mensagemDeErro(erro: unknown, padrao = 'Algo deu errado. Tenta de novo.'): string {
  if (axios.isAxiosError(erro)) {
    const detail = (erro.response?.data as { detail?: string } | undefined)?.detail
    if (detail) return detail
  }
  return padrao
}
