/** Fabrica central de query keys do dominio board/tarefas - mesmo motivo do projetosKeys (ver src/features/projetos/api/query-keys.ts). */
export const tarefasKeys = {
  tarefas: (projetoId: number) => ['tarefas', projetoId] as const,
  historico: (projetoId: number, tarefaId: number | undefined) => ['historico', projetoId, tarefaId] as const,
  relatorio: (projetoId: number) => ['relatorio', projetoId] as const,
}
