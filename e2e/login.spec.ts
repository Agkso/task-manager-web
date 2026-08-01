import { test, expect } from '@playwright/test'

/**
 * Sem backend real no ambiente de E2E: a API e' mockada via page.route,
 * cobrindo so o contrato (formato da resposta) que o frontend depende - o
 * comportamento do backend em si (regras de negocio, persistencia) e'
 * responsabilidade da suite do proprio backend. O que este teste garante e'
 * o fluxo critico end-to-end do lado do cliente: formulario -> chamada HTTP
 * -> sessao gravada -> redirecionamento -> tela protegida renderizada.
 *
 * O payload do token usa o mesmo fixture do teste unitario de jwt.ts (base64url
 * com '_', nome com acento) de proposito: e' o cenario exato do bug corrigido
 * (login que nunca avancava pra home) e agora tambem teria vazado mojibang no
 * nome exibido na navbar se a decodificacao UTF-8 nao estivesse correta.
 */
const PAYLOAD_BASE64URL = 'eyJ1c3VhcmlvSWQiOjEwLCJub21lIjoiSm_Do28iLCJzdWIiOiJ1c2VyMTBAZXhlbXBsby5jb20ifQ'
const TOKEN = `header.${PAYLOAD_BASE64URL}.signature`

test('login com sucesso leva o usuario da tela de login ate a listagem de projetos', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    const body = route.request().postDataJSON()
    expect(body).toEqual({ email: 'joao@exemplo.com', senha: 'senha-correta' })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: TOKEN, tipo: 'Bearer', refreshToken: 'refresh-token-fake' }),
    })
  })

  await page.route('**/api/projetos', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          nome: 'Projeto Alpha',
          descricao: 'Projeto de teste',
          donoId: 10,
          donoNome: 'João',
          criadoEm: '2026-01-01T00:00:00Z',
          atualizadoEm: '2026-01-01T00:00:00Z',
        },
      ]),
    })
  })

  await page.goto('/login')

  await page.getByLabel('Email').fill('joao@exemplo.com')
  await page.getByLabel('Senha').fill('senha-correta')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/projetos$/)
  await expect(page.getByRole('heading', { name: 'Seus projetos' })).toBeVisible()
  await expect(page.getByText('Projeto Alpha')).toBeVisible()
  // nome vem do JWT decodificado (com acento) - garante que a navbar mostra
  // o texto correto, nao mojibake, e que o usuario ficou autenticado
  await expect(page.getByRole('banner').getByText('João')).toBeVisible()
})

test('login com credenciais invalidas mostra erro e permanece na tela de login', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Email ou senha incorretos' }),
    })
  })

  await page.goto('/login')

  await page.getByLabel('Email').fill('joao@exemplo.com')
  await page.getByLabel('Senha').fill('senha-errada')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByText('Email ou senha incorretos')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})
