import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FolderKanban } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/navbar'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
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
        <PageHeader title="Seus projetos" actions={<CreateProjectDialog />} />

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && projetos?.length === 0 && (
          <EmptyState
            icon={FolderKanban}
            title="Nenhum projeto ainda"
            description="Cria o primeiro projeto pra comecar a organizar tarefas com seu time."
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projetos?.map((projeto) => (
            <Link key={projeto.id} to={`/projetos/${projeto.id}`}>
              <Card className="h-full gap-2 border-l-4 border-l-primary/70 transition-all hover:border-l-primary hover:shadow-md">
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
