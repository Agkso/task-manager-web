import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { ResetPasswordPage } from '../components/reset-password-page'
import { useResetPassword } from '@/features/auth/hooks/use-auth'

vi.mock('@/features/auth/hooks/use-auth', () => ({
  useResetPassword: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

const useResetPasswordMock = vi.mocked(useResetPassword)

function renderPagina(caminho: string) {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <ResetPasswordPage />
    </MemoryRouter>,
  )
}

describe('ResetPasswordPage', () => {
  const redefinirSenha = vi.fn()

  beforeEach(() => {
    redefinirSenha.mockReset()
    vi.mocked(toast.error).mockReset()
    useResetPasswordMock.mockReturnValue({
      mutate: redefinirSenha,
      isPending: false,
    } as unknown as ReturnType<typeof useResetPassword>)
  })

  it('mostra link invalido quando nao tem token na URL', () => {
    renderPagina('/redefinir-senha')

    expect(screen.getByText('Link invalido')).toBeInTheDocument()
    expect(redefinirSenha).not.toHaveBeenCalled()
  })

  it('envia token e nova senha quando as senhas conferem', async () => {
    const usuario = userEvent.setup()
    renderPagina('/redefinir-senha?token=abc123')

    await usuario.type(screen.getByLabelText('Nova senha'), 'senha-nova-123')
    await usuario.type(screen.getByLabelText('Confirmar nova senha'), 'senha-nova-123')
    await usuario.click(screen.getByRole('button', { name: 'Redefinir senha' }))

    expect(redefinirSenha).toHaveBeenCalledWith({ token: 'abc123', novaSenha: 'senha-nova-123' })
  })

  it('nao envia e mostra erro quando as senhas nao conferem', async () => {
    const usuario = userEvent.setup()
    renderPagina('/redefinir-senha?token=abc123')

    await usuario.type(screen.getByLabelText('Nova senha'), 'senha-nova-123')
    await usuario.type(screen.getByLabelText('Confirmar nova senha'), 'senha-diferente')
    await usuario.click(screen.getByRole('button', { name: 'Redefinir senha' }))

    expect(redefinirSenha).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('As senhas nao conferem')
  })
})
