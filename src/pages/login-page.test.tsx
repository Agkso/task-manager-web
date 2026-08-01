import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './login-page'
import { useLogin } from '@/hooks/use-auth'

vi.mock('@/hooks/use-auth', () => ({
  useLogin: vi.fn(),
}))

const useLoginMock = vi.mocked(useLogin)

function renderPagina() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  const login = vi.fn()

  beforeEach(() => {
    login.mockReset()
    useLoginMock.mockReturnValue({ mutate: login, isPending: false } as unknown as ReturnType<typeof useLogin>)
  })

  it('envia email e senha digitados ao submeter o formulario', async () => {
    const usuario = userEvent.setup()
    renderPagina()

    await usuario.type(screen.getByLabelText('Email'), 'ana@exemplo.com')
    await usuario.type(screen.getByLabelText('Senha'), 'senha-123')
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(login).toHaveBeenCalledWith({ email: 'ana@exemplo.com', senha: 'senha-123' })
  })

  it('desabilita o botao e muda o texto enquanto o login esta pendente', () => {
    useLoginMock.mockReturnValue({ mutate: login, isPending: true } as unknown as ReturnType<typeof useLogin>)
    renderPagina()

    const botao = screen.getByRole('button', { name: 'Entrando...' })
    expect(botao).toBeDisabled()
  })

  it('nao chama login se os campos obrigatorios estiverem vazios', async () => {
    const usuario = userEvent.setup()
    renderPagina()

    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(login).not.toHaveBeenCalled()
  })
})
