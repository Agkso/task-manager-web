import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SelectField } from '@/components/common/select-field'
import { DatePicker } from '@/components/common/date-picker'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProjectMembers } from '@/hooks/use-project-members'
import { useCreateTask } from '@/hooks/use-task-mutations'
import { OPCOES_PRIORIDADE, SEM_RESPONSAVEL } from '@/lib/options'
import type { Prioridade } from '@/types/api'

export function CreateTaskDialog({ projetoId }: { projetoId: number }) {
  const [aberto, setAberto] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState<Prioridade>('MEDIUM')
  const [prazo, setPrazo] = useState('')
  const [responsavelId, setResponsavelId] = useState(SEM_RESPONSAVEL)

  const { data: membros } = useProjectMembers(projetoId, { enabled: aberto })
  const { mutate: criar, isPending } = useCreateTask(projetoId)

  function limparEFechar() {
    setAberto(false)
    setTitulo('')
    setDescricao('')
    setPrioridade('MEDIUM')
    setPrazo('')
    setResponsavelId(SEM_RESPONSAVEL)
  }

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    criar(
      {
        titulo,
        descricao: descricao || undefined,
        prioridade,
        prazo: prazo ? new Date(prazo).toISOString() : undefined,
        responsavelId: responsavelId === SEM_RESPONSAVEL ? undefined : Number(responsavelId),
      },
      { onSuccess: limparEFechar },
    )
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Nova tarefa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={aoSubmeter}>
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo-tarefa">Titulo</Label>
              <Input id="titulo-tarefa" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao-tarefa">Descricao</Label>
              <Textarea id="descricao-tarefa" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                id="prioridade-tarefa"
                label="Prioridade"
                value={prioridade}
                onChange={setPrioridade}
                options={OPCOES_PRIORIDADE}
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor="prazo-tarefa">Prazo</Label>
                <DatePicker id="prazo-tarefa" value={prazo} onChange={setPrazo} />
              </div>
            </div>
            <SelectField
              id="responsavel-tarefa"
              label="Responsavel"
              value={responsavelId}
              onChange={setResponsavelId}
              options={[
                { value: SEM_RESPONSAVEL, label: 'Sem responsavel' },
                ...(membros?.map((m) => ({ value: String(m.usuarioId), label: m.nome })) ?? []),
              ]}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
