import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/layout/auth-layout'
import { useRegister } from '@/hooks/use-auth'

export function RegisterPage() {
  const { mutate: registrar, isPending } = useRegister()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    registrar({ nome, email, senha })
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">Leva menos de um minuto</p>
      </div>
      <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
        </div>
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
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            required
            minLength={8}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">Minimo 8 caracteres</p>
        </div>
        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? 'Criando...' : 'Criar conta'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ja tem conta?{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
