import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo } from '@/components/brand/logo'
import { useAuth, useLogout } from '@/hooks/use-auth'

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
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/projetos">
          <Logo />
        </Link>
        {usuario && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{iniciais(usuario.nome)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm text-muted-foreground sm:inline">{usuario.nome}</span>
            <Button variant="ghost" size="icon" onClick={() => logout()} aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
