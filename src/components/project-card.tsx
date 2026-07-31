import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { RespostaProjeto } from '@/types/api'

function iniciais(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')
}

/** Puramente apresentacional - dados vem prontos via props, nenhum fetch aqui. */
export function ProjectCard({ projeto }: { projeto: RespostaProjeto }) {
  return (
    <Card className="h-full gap-0 overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-1.5 bg-gradient-to-r from-brand to-brand/40" />
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold tracking-tight">{projeto.nome}</h3>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-brand/15 text-xs font-medium text-brand">
              {iniciais(projeto.nome)}
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {projeto.descricao || 'Sem descricao'}
        </p>
        <p className="text-xs text-muted-foreground">Dono: {projeto.donoNome}</p>
      </CardContent>
    </Card>
  )
}
