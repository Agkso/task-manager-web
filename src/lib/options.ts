import type { Papel, Prioridade } from '@/types/api'

export const OPCOES_PRIORIDADE: { value: Prioridade; label: string }[] = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Critica' },
]

export const OPCOES_PAPEL: { value: Papel; label: string }[] = [
  { value: 'MEMBER', label: 'Membro' },
  { value: 'ADMIN', label: 'Admin' },
]

export const SEM_RESPONSAVEL = 'nenhum'
