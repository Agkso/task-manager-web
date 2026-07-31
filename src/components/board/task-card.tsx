import { useDraggable } from '@dnd-kit/core'
import { CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/board/priority-badge'
import type { RespostaTarefa } from '@/types/api'
import { cn } from '@/lib/utils'

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function TaskCard({ tarefa, onClick }: { tarefa: RespostaTarefa; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarefa.id,
  })

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={
        transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
      }
      className={cn(
        'cursor-grab touch-none gap-2 py-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        isDragging && 'z-10 opacity-60 shadow-lg',
      )}
    >
      <CardHeader className="px-3">
        <CardTitle className="text-sm leading-snug font-medium">{tarefa.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-3">
        <PriorityBadge prioridade={tarefa.prioridade} />
        <div className="flex items-center gap-2">
          {tarefa.prazo && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {formatarData(tarefa.prazo)}
            </span>
          )}
          {tarefa.responsavelNome && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {tarefa.responsavelNome.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
