import { Link } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/navbar'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { CreateProjectDialog } from '@/components/create-project-dialog'
import { ProjectCard } from '@/components/project-card'
import { useProjects } from '@/hooks/use-projects'

export function ProjectsPage() {
  const { data: projetos, isLoading } = useProjects()

  return (
    <div className="min-h-svh">
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <PageHeader title="Seus projetos" actions={<CreateProjectDialog />} />

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
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
              <ProjectCard projeto={projeto} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
