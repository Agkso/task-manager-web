import { useState, type FormEvent } from 'react'
import { Users, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Badge } from '@/shared/ui/badge'
import { SelectField } from '@/shared/components/select-field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { useProjectMembers, useAddMember, useRemoveMember } from '@/features/projetos/hooks/use-project-members'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { OPCOES_PAPEL } from '@/features/projetos/options'
import type { Papel } from '@/features/projetos/types'

export function MembersDialog({ projetoId }: { projetoId: number }) {
  const [aberto, setAberto] = useState(false)
  const [email, setEmail] = useState('')
  const [papel, setPapel] = useState<Papel>('MEMBER')
  const { usuario } = useAuth()

  const { data: membros } = useProjectMembers(projetoId, { enabled: aberto })
  const { mutate: adicionar, isPending } = useAddMember(projetoId)
  const { mutate: remover } = useRemoveMember(projetoId)

  const souAdmin = membros?.some((m) => m.usuarioId === usuario?.usuarioId && m.papel === 'ADMIN') ?? false

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    adicionar({ email, papel }, { onSuccess: () => setEmail('') })
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4" />
          Membros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
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
            <SelectField className="w-28" value={papel} onChange={setPapel} options={OPCOES_PAPEL} />
            <Button type="submit" disabled={isPending}>
              Adicionar
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
