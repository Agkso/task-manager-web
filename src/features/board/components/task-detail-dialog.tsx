import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { SelectField } from '@/shared/components/select-field'
import { DatePicker } from '@/shared/components/date-picker'
import { Separator } from '@/shared/ui/separator'
import { ScrollArea } from '@/shared/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { useProjectMembers } from '@/features/projetos/hooks/use-project-members'
import { useUpdateTask, useDeleteTask } from '@/features/board/hooks/use-task-mutations'
import { useTaskHistory } from '@/features/board/hooks/use-task-history'
import { OPCOES_PRIORIDADE, SEM_RESPONSAVEL } from '@/features/board/options'
import type { Prioridade, RespostaTarefa } from '@/features/board/types'

function paraInputDate(iso: string | null) {
  return iso ? iso.slice(0, 10) : ''
}

/**
 * So renderiza quando ha uma tarefa selecionada, com key={tarefa.id} no
 * componente pai - trocar de tarefa remonta o formulario do zero, entao o
 * estado local (titulo/descricao/...) ja nasce inicializado com os dados
 * certos via useState(() => ...), sem precisar de um useEffect sincronizando
 * state a partir de props (o lint react-hooks/set-state-in-effect existe
 * exatamente pra pegar esse padrao - setState sincrono dentro de effect
 * causa um render a mais toda vez que a tarefa muda).
 */
function TaskDetailForm({
  projetoId,
  tarefa,
  onOpenChange,
}: {
  projetoId: number
  tarefa: RespostaTarefa
  onOpenChange: (aberto: boolean) => void
}) {
  const [titulo, setTitulo] = useState(tarefa.titulo)
  const [descricao, setDescricao] = useState(tarefa.descricao ?? '')
  const [prioridade, setPrioridade] = useState<Prioridade>(tarefa.prioridade)
  const [prazo, setPrazo] = useState(paraInputDate(tarefa.prazo))
  const [responsavelId, setResponsavelId] = useState(
    tarefa.responsavelId ? String(tarefa.responsavelId) : SEM_RESPONSAVEL,
  )

  const { data: membros } = useProjectMembers(projetoId)
  const { data: historico } = useTaskHistory(projetoId, tarefa.id)
  const { mutate: salvar, isPending: salvando } = useUpdateTask(projetoId)
  const { mutate: excluir, isPending: excluindo } = useDeleteTask(projetoId)

  function aoSalvar() {
    salvar(
      {
        tarefaId: tarefa.id,
        dados: {
          titulo,
          descricao: descricao || undefined,
          prioridade,
          prazo: prazo ? new Date(prazo).toISOString() : undefined,
          responsavelId: responsavelId === SEM_RESPONSAVEL ? undefined : Number(responsavelId),
        },
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  function aoExcluir() {
    excluir(tarefa.id, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo-edicao">Titulo</Label>
        <Input id="titulo-edicao" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="descricao-edicao">Descricao</Label>
        <Textarea id="descricao-edicao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="prioridade-edicao"
          label="Prioridade"
          value={prioridade}
          onChange={setPrioridade}
          options={OPCOES_PRIORIDADE}
        />
        <div className="flex flex-col gap-2">
          <Label htmlFor="prazo-edicao">Prazo</Label>
          <DatePicker id="prazo-edicao" value={prazo} onChange={setPrazo} />
        </div>
      </div>
      <SelectField
        id="responsavel-edicao"
        label="Responsavel"
        value={responsavelId}
        onChange={setResponsavelId}
        options={[
          { value: SEM_RESPONSAVEL, label: 'Sem responsavel' },
          ...(membros?.map((m) => ({ value: String(m.usuarioId), label: m.nome })) ?? []),
        ]}
      />

      {historico && historico.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="mb-2 text-sm font-medium">Historico</p>
            <ScrollArea className="h-24">
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {historico.map((item) => (
                  <li key={item.id}>
                    {item.statusAnterior} → {item.statusNovo} por {item.usuarioNome} em{' '}
                    {new Date(item.alteradoEm).toLocaleString('pt-BR')}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </>
      )}

      <div className="flex items-center justify-between pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir esta tarefa?</AlertDialogTitle>
              <AlertDialogDescription>Essa acao nao pode ser desfeita pela interface.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction disabled={excluindo} onClick={aoExcluir}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="button" disabled={salvando} onClick={aoSalvar}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  )
}

export function TaskDetailDialog({
  projetoId,
  tarefa,
  onOpenChange,
}: {
  projetoId: number
  tarefa: RespostaTarefa | null
  onOpenChange: (aberto: boolean) => void
}) {
  return (
    <Dialog open={Boolean(tarefa)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>
        {tarefa && (
          <TaskDetailForm key={tarefa.id} projetoId={projetoId} tarefa={tarefa} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  )
}
