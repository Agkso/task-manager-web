import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { projetosApi, tarefasApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import type { Prioridade, RespostaTarefa } from '@/types/api'

const SEM_RESPONSAVEL = 'nenhum'

function paraInputDate(iso: string | null) {
  return iso ? iso.slice(0, 10) : ''
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
  const queryClient = useQueryClient()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState<Prioridade>('MEDIUM')
  const [prazo, setPrazo] = useState('')
  const [responsavelId, setResponsavelId] = useState(SEM_RESPONSAVEL)

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo)
      setDescricao(tarefa.descricao ?? '')
      setPrioridade(tarefa.prioridade)
      setPrazo(paraInputDate(tarefa.prazo))
      setResponsavelId(tarefa.responsavelId ? String(tarefa.responsavelId) : SEM_RESPONSAVEL)
    }
  }, [tarefa])

  const { data: membros } = useQuery({
    queryKey: ['membros', projetoId],
    queryFn: () => projetosApi.listarMembros(projetoId),
    enabled: Boolean(tarefa),
  })

  const { data: historico } = useQuery({
    queryKey: ['historico', projetoId, tarefa?.id],
    queryFn: () => tarefasApi.historico(projetoId, tarefa!.id),
    enabled: Boolean(tarefa),
  })

  const { mutate: salvar, isPending: salvando } = useMutation({
    mutationFn: () =>
      tarefasApi.atualizar(projetoId, tarefa!.id, {
        titulo,
        descricao: descricao || undefined,
        prioridade,
        prazo: prazo ? new Date(prazo).toISOString() : undefined,
        responsavelId: responsavelId === SEM_RESPONSAVEL ? undefined : Number(responsavelId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas', projetoId] })
      toast.success('Tarefa atualizada')
      onOpenChange(false)
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel atualizar a tarefa')),
  })

  const { mutate: excluir, isPending: excluindo } = useMutation({
    mutationFn: () => tarefasApi.excluir(projetoId, tarefa!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas', projetoId] })
      toast.success('Tarefa excluida')
      onOpenChange(false)
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel excluir a tarefa')),
  })

  return (
    <Dialog open={Boolean(tarefa)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="titulo-edicao">Titulo</Label>
            <Input id="titulo-edicao" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao-edicao">Descricao</Label>
            <Textarea id="descricao-edicao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Prioridade</Label>
              <Select value={prioridade} onValueChange={(v) => setPrioridade(v as Prioridade)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="CRITICAL">Critica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prazo-edicao">Prazo</Label>
              <Input id="prazo-edicao" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Responsavel</Label>
            <Select value={responsavelId} onValueChange={setResponsavelId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SEM_RESPONSAVEL}>Sem responsavel</SelectItem>
                {membros?.map((membro) => (
                  <SelectItem key={membro.usuarioId} value={String(membro.usuarioId)}>
                    {membro.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                  <AlertDialogAction disabled={excluindo} onClick={() => excluir()}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="button" disabled={salvando} onClick={() => salvar()}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
