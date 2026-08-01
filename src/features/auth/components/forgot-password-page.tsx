import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { useForgotPassword } from '@/features/auth/hooks/use-auth'

export function ForgotPasswordPage() {
  const { mutate: esqueciSenha, isPending, isSuccess } = useForgotPassword()
  const [email, setEmail] = useState('')

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    esqueciSenha({ email })
  }

  // mensagem fixa mesmo com o request ja resolvido (isSuccess) - o backend
  // responde igual exista ou nao o email, entao a tela nunca diz "email
  // encontrado"/"nao encontrado"
  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Verifique seu email</h1>
          <p className="text-base text-muted-foreground">
            Se existir uma conta com o email <span className="font-medium text-foreground">{email}</span>, voce vai
            receber um link pra redefinir sua senha em instantes.
          </p>
        </div>
        <p className="mt-6 text-center text-base text-muted-foreground">
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Voltar pro login
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Esqueceu sua senha?</h1>
        <p className="text-base text-muted-foreground">
          Digite seu email e mandamos um link pra voce escolher uma senha nova.
        </p>
      </div>
      <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? 'Enviando...' : 'Enviar link de redefinicao'}
        </Button>
      </form>
      <p className="mt-6 text-center text-base text-muted-foreground">
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Voltar pro login
        </Link>
      </p>
    </AuthLayout>
  )
}
