import type { Prioridade } from '@/features/tarefas/types'

export const OPCOES_PRIORIDADE: { value: Prioridade; label: string }[] = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Critica' },
]

export const SEM_RESPONSAVEL = 'nenhum'
