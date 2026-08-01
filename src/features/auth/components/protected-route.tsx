import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth-store'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
