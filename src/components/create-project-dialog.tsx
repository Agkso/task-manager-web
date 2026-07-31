import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { projetosApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'

export function CreateProjectDialog() {
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => projetosApi.criar({ nome, descricao: descricao || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] })
      toast.success('Projeto criado')
      setAberto(false)
      setNome('')
      setDescricao('')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel criar o projeto')),
  })

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    mutate()
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Novo projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={aoSubmeter}>
          <DialogHeader>
            <DialogTitle>Novo projeto</DialogTitle>
            <DialogDescription>Voce vira ADMIN dele automaticamente.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome-projeto">Nome</Label>
              <Input id="nome-projeto" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao-projeto">Descricao</Label>
              <Textarea id="descricao-projeto" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
