import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { AuthLayout } from '@/features/auth/components/auth-layout'
import { useLogin } from '@/features/auth/hooks/use-auth'

export function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    login({ email, senha })
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-base text-muted-foreground">Acesse seus projetos e tarefas</p>
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="senha">Senha</Label>
            <Link to="/esqueci-senha" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p className="mt-6 text-center text-base text-muted-foreground">
        Não tem conta?{' '}
        <Link to="/registrar" className="font-medium text-foreground underline underline-offset-4">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  )
}
