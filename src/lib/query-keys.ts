/**
 * Fabrica central de query keys - toda chave usada em useQuery/
 * invalidateQueries/setQueryData vem daqui, nunca um array literal solto
 * num hook. Sem isso e' facil um hook invalidar ['tarefas', projetoId] e
 * outro escrever ['tarefa', projetoId] por engano (cache nunca invalida,
 * bug silencioso) - com a fabrica, o typo vira erro de import, nao bug de
 * runtime.
 */
export const queryKeys = {
  projetos: ['projetos'] as const,
  projeto: (projetoId: number) => ['projeto', projetoId] as const,
  membros: (projetoId: number) => ['membros', projetoId] as const,
  auditoria: (projetoId: number) => ['auditoria', projetoId] as const,
  tarefas: (projetoId: number) => ['tarefas', projetoId] as const,
  historico: (projetoId: number, tarefaId: number | undefined) => ['historico', projetoId, tarefaId] as const,
}
