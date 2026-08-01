import type { ReactNode } from 'react'
import { LogoMark } from '@/shared/components/logo'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, oklch(1 0 0 / 0.15), transparent 40%), radial-gradient(circle at 85% 80%, oklch(1 0 0 / 0.12), transparent 45%)',
          }}
        />
        <span className="relative inline-flex items-center gap-2 text-primary-foreground">
          <LogoMark className="h-7 w-7" />
          <span className="text-lg font-semibold tracking-tight">Task Manager</span>
        </span>
        <blockquote className="relative max-w-md text-primary-foreground/90">
          <p className="text-2xl leading-snug font-medium text-balance">
            Projetos organizados por status, com board em tempo real pro time inteiro ver a mesma coisa.
          </p>
        </blockquote>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <span className="inline-flex items-center gap-2 text-brand">
              <LogoMark />
              <span className="text-base font-semibold tracking-tight text-foreground">Task Manager</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
