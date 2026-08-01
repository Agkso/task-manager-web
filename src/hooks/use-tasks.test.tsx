import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { useMoveTask } from './use-tasks'
import { tarefasApi } from '@/lib/resources'
import type { RespostaTarefa } from '@/types/api'

vi.mock('@/lib/resources', () => ({
  tarefasApi: {
    mudarStatus: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const tarefaMock = { id: 1, status: 'IN_PROGRESS' } as RespostaTarefa

describe('useMoveTask', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mostra toast de sucesso com o nome da coluna so depois do servidor confirmar', async () => {
    vi.mocked(tarefasApi.mudarStatus).mockResolvedValue(tarefaMock)
    const { result } = renderHook(() => useMoveTask(1), { wrapper })

    result.current.mutate({ tarefaId: 1, status: 'IN_PROGRESS' })

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Tarefa movida para "Em andamento"'))
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('mostra toast de erro (nao de sucesso) se o servidor rejeitar a mudanca', async () => {
    vi.mocked(tarefasApi.mudarStatus).mockRejectedValue(new Error('falhou'))
    const { result } = renderHook(() => useMoveTask(1), { wrapper })

    result.current.mutate({ tarefaId: 1, status: 'DONE' })

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(toast.success).not.toHaveBeenCalled()
  })
})
