import { useState } from 'react'
import { ScrollText } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { ScrollArea } from '@/shared/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { useProjectAudit } from '@/features/projetos/hooks/use-project-audit'

const rotulosAcao: Record<string, string> = {
  PROJETO_CRIADO: 'Projeto criado',
  PROJETO_ATUALIZADO: 'Projeto atualizado',
  PROJETO_EXCLUIDO: 'Projeto excluido',
  MEMBRO_ADICIONADO: 'Membro adicionado',
  MEMBRO_REMOVIDO: 'Membro removido',
  TAREFA_CRIADA: 'Tarefa criada',
  TAREFA_ATUALIZADA: 'Tarefa atualizada',
  TAREFA_EXCLUIDA: 'Tarefa excluida',
  USUARIO_REGISTRADO: 'Usuario registrado',
  LOGIN_SUCEDIDO: 'Login',
  SENHA_RESET_SOLICITADO: 'Redefinicao de senha solicitada',
  SENHA_REDEFINIDA: 'Senha redefinida',
}

export function AuditLogDialog({ projetoId }: { projetoId: number }) {
  const [aberto, setAberto] = useState(false)
  const { data, isLoading, isError } = useProjectAudit(projetoId, { enabled: aberto })

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ScrollText className="h-4 w-4" />
          Auditoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log de auditoria</DialogTitle>
          <DialogDescription>Visivel so pra ADMIN do projeto.</DialogDescription>
        </DialogHeader>

        {isError && (
          <p className="text-sm text-muted-foreground">
            Voce precisa ser ADMIN deste projeto pra ver a auditoria.
          </p>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

        {data && data.conteudo.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum evento registrado ainda.</p>
        )}

        {data && data.conteudo.length > 0 && (
          <ScrollArea className="h-72">
            <ul className="flex flex-col gap-2">
              {data.conteudo.map((log) => (
                <li key={log.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div>
                    <Badge variant="secondary" className="mb-1">
                      {rotulosAcao[log.acao] ?? log.acao}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {log.tipoEntidade} #{log.entidadeId}
                      {log.detalhe ? ` · ${log.detalhe}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.criadoEm).toLocaleString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
