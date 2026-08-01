import { Link } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { Skeleton } from '@/shared/ui/skeleton'
import { Navbar } from '@/shared/components/navbar'
import { PageHeader } from '@/shared/components/page-header'
import { EmptyState } from '@/shared/components/empty-state'
import { CreateProjectDialog } from '@/features/projetos/components/create-project-dialog'
import { ProjectCard } from '@/features/projetos/components/project-card'
import { useProjects } from '@/features/projetos/hooks/use-projects'

export function ProjectsPage() {
  const { data: projetos, isLoading } = useProjects()

  return (
    <div className="min-h-svh">
      <Navbar />
      <main className="w-full p-6">
        <PageHeader title="Seus projetos" actions={<CreateProjectDialog />} />

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
