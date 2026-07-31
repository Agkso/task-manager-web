import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { projetosApi } from '@/lib/resources'
import { mensagemDeErro } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import type { Papel } from '@/types/api'

export function MembersDialog({ projetoId }: { projetoId: number }) {
  const [aberto, setAberto] = useState(false)
  const [email, setEmail] = useState('')
  const [papel, setPapel] = useState<Papel>('MEMBER')
  const queryClient = useQueryClient()
  const { usuario } = useAuth()

  const { data: membros } = useQuery({
    queryKey: ['membros', projetoId],
    queryFn: () => projetosApi.listarMembros(projetoId),
    enabled: aberto,
  })

  const souAdmin = membros?.some((m) => m.usuarioId === usuario?.usuarioId && m.papel === 'ADMIN') ?? false

  const { mutate: adicionar, isPending } = useMutation({
    mutationFn: () => projetosApi.adicionarMembro(projetoId, { email, papel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros', projetoId] })
      toast.success('Membro adicionado')
      setEmail('')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel adicionar')),
  })

  const { mutate: remover } = useMutation({
    mutationFn: (usuarioId: number) => projetosApi.removerMembro(projetoId, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros', projetoId] })
      toast.success('Membro removido')
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Nao foi possivel remover')),
  })

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    adicionar()
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4" />
          Membros
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Membros do projeto</DialogTitle>
          <DialogDescription>Apenas ADMIN pode adicionar ou remover.</DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-2">
          {membros?.map((membro) => (
            <li key={membro.usuarioId} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-sm font-medium">{membro.nome}</p>
                <p className="text-xs text-muted-foreground">{membro.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{membro.papel}</Badge>
                {souAdmin && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => remover(membro.usuarioId)}
                    aria-label={`Remover ${membro.nome}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {souAdmin && (
          <form onSubmit={aoSubmeter} className="flex items-end gap-2 pt-2">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="email-membro">Email</Label>
              <Input
                id="email-membro"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Select value={papel} onValueChange={(v) => setPapel(v as Papel)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Membro</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isPending}>
              Adicionar
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
