import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

/**
 * Assina o stream SSE de mudancas de status do projeto e invalida a query de
 * tarefas quando algo chega - o board reflete a mudanca de outro usuario sem
 * polling. Token vai via query param (?token=) porque EventSource nao deixa
 * mandar header Authorization - o backend aceita esse fallback so pra isso
 * (ver FiltroAutenticacaoJwt no repo do backend).
 */
export function useTaskEvents(projetoId: number) {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) return

    const url = `${baseURL}/api/projetos/${projetoId}/tarefas/eventos?token=${encodeURIComponent(token)}`
    const eventSource = new EventSource(url)

    eventSource.addEventListener('status-alterado', () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas', projetoId] })
    })

    // EventSource reconecta sozinho em erro de rede/timeout - nao precisa de logica extra aqui
    eventSource.onerror = () => {}

    return () => eventSource.close()
  }, [projetoId, token, queryClient])
}
