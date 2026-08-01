/**
 * Fabrica central de query keys do dominio projetos - toda chave usada em
 * useQuery/invalidateQueries/setQueryData vem daqui, nunca um array literal
 * solto num hook. Sem isso e' facil um hook invalidar ['membros', projetoId]
 * e outro escrever ['membro', projetoId] por engano (cache nunca invalida,
 * bug silencioso) - com a fabrica, o typo vira erro de import, nao bug de
 * runtime.
 */
export const projetosKeys = {
  projetos: ['projetos'] as const,
  projeto: (projetoId: number) => ['projeto', projetoId] as const,
  membros: (projetoId: number) => ['membros', projetoId] as const,
  auditoria: (projetoId: number) => ['auditoria', projetoId] as const,
}
