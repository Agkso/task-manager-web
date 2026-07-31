import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'
import { ProtectedRoute } from '@/components/protected-route'
import { LoginPage } from '@/pages/login-page'
import { RegisterPage } from '@/pages/register-page'
import { ProjectsPage } from '@/pages/projects-page'
import { BoardPage } from '@/pages/board-page'

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
