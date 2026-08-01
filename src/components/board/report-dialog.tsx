import { useState } from 'react'
import { ChartColumn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProjectReport } from '@/hooks/use-project-report'
import { COLUNAS } from '@/lib/board-columns'
import type { Prioridade, StatusTarefa } from '@/types/api'

const rotulosPrioridade: Record<Prioridade, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Critica',
}

const coresPrioridade: Record<Prioridade, string> = {
  LOW: 'bg-slate-400',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-amber-500',
  CRITICAL: 'bg-red-500',
}

function LinhaContagem({ rotulo, valor, total, cor }: { rotulo: string; valor: number; total: number; cor: string }) {
  const percentual = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span>{rotulo}</span>
        <span className="text-muted-foreground">{valor}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${cor}`} style={{ width: `${percentual}%` }} />
      </div>
    </li>
  )
}

export function ReportDialog({ projetoId }: { projetoId: number }) {
  const [aberto, setAberto] = useState(false)
  const { data, isLoading } = useProjectReport(projetoId, { enabled: aberto })

  const totalStatus = data ? Object.values(data.byStatus).reduce((soma, n) => soma + n, 0) : 0
  const totalPrioridade = data ? Object.values(data.byPriority).reduce((soma, n) => soma + n, 0) : 0

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ChartColumn className="h-4 w-4" />
          Relatorio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relatorio do projeto</DialogTitle>
          <DialogDescription>Distribuicao das tarefas por status e prioridade.</DialogDescription>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

        {data && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Por status</h3>
              <ul className="flex flex-col gap-3">
                {COLUNAS.map((coluna) => (
                  <LinhaContagem
                    key={coluna.status}
                    rotulo={coluna.titulo}
                    valor={data.byStatus[coluna.status as StatusTarefa] ?? 0}
                    total={totalStatus}
                    cor={coluna.corPonto}
                  />
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Por prioridade</h3>
              <ul className="flex flex-col gap-3">
                {(Object.keys(rotulosPrioridade) as Prioridade[]).map((prioridade) => (
                  <LinhaContagem
                    key={prioridade}
                    rotulo={rotulosPrioridade[prioridade]}
                    valor={data.byPriority[prioridade] ?? 0}
                    total={totalPrioridade}
                    cor={coresPrioridade[prioridade]}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
