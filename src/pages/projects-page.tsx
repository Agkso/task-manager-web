import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/navbar'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { projetosApi } from '@/lib/resources'

export function ProjectsPage() {
  const { data: projetos, isLoading } = useQuery({
    queryKey: ['projetos'],
    queryFn: projetosApi.listar,
  })

  return (
    <div className="min-h-svh">
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Seus projetos</h1>
          <CreateProjectDialog />
        </div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && projetos?.length === 0 && (
          <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
            Nenhum projeto ainda. Cria o primeiro.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projetos?.map((projeto) => (
            <Link key={projeto.id} to={`/projetos/${projeto.id}`}>
              <Card className="h-full transition-colors hover:border-foreground/30">
                <CardHeader>
                  <CardTitle>{projeto.nome}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {projeto.descricao || 'Sem descricao'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
