import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/shared/ui/sonner'
import { queryClient } from '@/shared/lib/query-client'
import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { LoginPage } from '@/features/auth/components/login-page'
import { RegisterPage } from '@/features/auth/components/register-page'
import { ProjectsPage } from '@/features/projetos/components/projects-page'
import { BoardPage } from '@/features/board/components/board-page'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/projetos/:projetoId" element={<BoardPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/projetos" replace />} />
          <Route path="*" element={<Navigate to="/projetos" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
