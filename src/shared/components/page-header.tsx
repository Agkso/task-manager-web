import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function PageHeader({
  title,
  backTo,
  actions,
}: {
  title: string
  backTo?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {backTo && (
          <Button asChild variant="ghost" size="icon">
            <Link to={backTo} aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
