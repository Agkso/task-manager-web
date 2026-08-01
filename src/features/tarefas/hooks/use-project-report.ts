import { useQuery } from '@tanstack/react-query'
import { tarefasApi } from '@/features/tarefas/api/tarefas-api'
import { tarefasKeys } from '@/features/tarefas/api/query-keys'

/**
 * Relatorio (contagem de tarefas por status/prioridade) e' uma agregacao no
 * backend, mais cara de recalcular que um simples SELECT de listagem - por
 * isso staleTime maior que o default global (30s) da queryClient. Nao tem
 * risco de mostrar dado velho porque a consistencia vem de invalidacao
 * explicita, no' o staleTime: toda mutation de tarefa (criar/atualizar/
 * excluir/mudar status) e o evento SSE de status-alterado invalidam
 * tarefasKeys.relatorio junto com tarefasKeys.tarefas (ver use-task-mutations,
 * use-tasks e use-task-events). staleTime aqui so evita refetch redundante
 * se o usuario abrir e fechar o dialog de relatorio varias vezes sem nada
 * ter mudado nesse meio tempo.
 */
export function useProjectReport(projetoId: number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: tarefasKeys.relatorio(projetoId),
    queryFn: () => tarefasApi.relatorio(projetoId),
    enabled: options.enabled ?? true,
    staleTime: 60_000,
  })
}
