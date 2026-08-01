import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { useResetPassword } from '@/features/auth/hooks/use-auth'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { mutate: redefinirSenha, isPending } = useResetPassword()
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas nao conferem')
      return
    }
    // nao deveria acontecer (link so existe com token), mas o TS exige a checagem
    if (!token) return
    redefinirSenha({ token, novaSenha })
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Link invalido</h1>
          <p className="text-sm text-muted-foreground">
            Esse link de redefinicao de senha esta incompleto ou invalido. Solicite um novo.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/esqueci-senha" className="font-medium text-foreground underline underline-offset-4">
            Pedir novo link
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Escolha uma nova senha</h1>
        <p className="text-sm text-muted-foreground">Depois de redefinir, voce precisa entrar de novo.</p>
      </div>
      <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nova-senha">Nova senha</Label>
          <Input
            id="nova-senha"
            type="password"
            required
            minLength={8}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
          <Input
            id="confirmar-senha"
            type="password"
            required
            minLength={8}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? 'Salvando...' : 'Redefinir senha'}
        </Button>
      </form>
    </AuthLayout>
  )
}
