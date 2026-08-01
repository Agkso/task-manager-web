import { cn } from '@/lib/utils'

/**
 * Mark proprio (3 barras de altura desigual, lendo como colunas de board) em
 * vez de um icone generico de lib de icones - e' o unico lugar da marca que
 * aparece sozinho (favicon usa o mesmo desenho), entao vale ser algo
 * desenhado pra este produto e nao emprestado.
 */
/** A barra mais curta usa a segunda cor da marca (coral) - as outras duas ficam em currentColor (verde) com opacidade, igual antes. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-6 w-6', className)} aria-hidden="true">
      <rect x="2" y="9" width="5" height="13" rx="1.5" fill="var(--brand-accent)" />
      <rect x="9.5" y="2" width="5" height="20" rx="1.5" fill="currentColor" />
      <rect x="17" y="6" width="5" height="16" rx="1.5" fill="currentColor" opacity="0.75" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-brand', className)}>
      <LogoMark />
      <span className="text-base font-semibold tracking-tight text-foreground">Task Manager</span>
    </span>
  )
}
