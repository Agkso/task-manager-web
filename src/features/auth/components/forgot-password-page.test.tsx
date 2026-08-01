import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForgotPasswordPage } from './forgot-password-page'
import { useForgotPassword } from '@/features/auth/hooks/use-auth'

vi.mock('@/features/auth/hooks/use-auth', () => ({
  useForgotPassword: vi.fn(),
}))

const useForgotPasswordMock = vi.mocked(useForgotPassword)

function renderPagina() {
  return render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  )
}

describe('ForgotPasswordPage', () => {
  const esqueciSenha = vi.fn()

  beforeEach(() => {
    esqueciSenha.mockReset()
    useForgotPasswordMock.mockReturnValue({
      mutate: esqueciSenha,
      isPending: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useForgotPassword>)
  })

  it('envia o email digitado ao submeter', async () => {
    const usuario = userEvent.setup()
    renderPagina()

    await usuario.type(screen.getByLabelText('Email'), 'ana@exemplo.com')
    await usuario.click(screen.getByRole('button', { name: 'Enviar link de redefinicao' }))

    expect(esqueciSenha).toHaveBeenCalledWith({ email: 'ana@exemplo.com' })
  })

  it('mostra mensagem generica de confirmacao apos o envio, sem revelar se o email existe', () => {
    useForgotPasswordMock.mockReturnValue({
      mutate: esqueciSenha,
      isPending: false,
      isSuccess: true,
    } as unknown as ReturnType<typeof useForgotPassword>)
    renderPagina()

    expect(screen.getByText('Verifique seu email')).toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
  })
})
