import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Logo } from '@/shared/components/logo'
import { useAuth, useLogout } from '@/features/auth/hooks/use-auth'

function iniciais(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')
}

export function Navbar() {
  const { usuario } = useAuth()
  const { mutate: logout } = useLogout()

  return (
    <header className="border-b">
      <div className="flex h-14 w-full items-center justify-between px-6">
        <Link to="/projetos">
          <Logo />
        </Link>
        {usuario && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">{iniciais(usuario.nome)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-base text-muted-foreground sm:inline">{usuario.nome}</span>
            <Button variant="ghost" size="icon" onClick={() => logout()} aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
