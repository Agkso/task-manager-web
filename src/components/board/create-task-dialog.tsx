import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { projetosApi, tarefasApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import type { Prioridade } from '@/types/api'

const SEM_RESPONSAVEL = 'nenhum'

export function CreateTaskDialog({ projetoId }: { projetoId: number }) {
  const [aberto, setAberto] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState<Prioridade>('MEDIUM')
  const [prazo, setPrazo] = useState('')
  const [responsavelId, setResponsavelId] = useState(SEM_RESPONSAVEL)
  const queryClient = useQueryClient()

  const { data: membros } = useQuery({
    queryKey: ['membros', projetoId],
    queryFn: () => projetosApi.listarMembros(projetoId),
    enabled: aberto,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      tarefasApi.criar(projetoId, {
        titulo,
        descricao: descricao || undefined,
        prioridade,
        prazo: prazo ? new Date(prazo).toISOString() : undefined,
        responsavelId: responsavelId === SEM_RESPONSAVEL ? undefined : Number(responsavelId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarefas', projetoId] })
      toast.success('Tarefa criada')
      limparEFechar()
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel criar a tarefa')),
  })

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
    mutate()
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
                <Label htmlFor="prazo-tarefa">Prazo</Label>
                <Input
                  id="prazo-tarefa"
                  type="date"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                />
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
