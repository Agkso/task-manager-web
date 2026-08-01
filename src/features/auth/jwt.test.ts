import { describe, expect, it } from 'vitest'
import { decodeJwtPayload } from './jwt'

interface ClaimsToken {
  usuarioId: number
  nome: string
  sub: string
}

/**
 * Payload escolhido de proposito: o JSON { usuarioId: 10, nome: "João", sub: ... }
 * vira, em base64 padrao, "...Sm/Do28i..." (contem '/'). Em base64url (o que
 * um JWT de verdade usa) esse mesmo trecho vira "...Sm_Do28i..." - se o
 * decoder tratasse isso como base64 padrao (ex.: atob() puro), o '_' e' um
 * caractere invalido pro alfabeto base64 e o parse quebra. Esse era exatamente
 * o bug em producao: login com certos nomes/emails nunca avancava pra home
 * porque decodificarUsuario lancava antes do navigate rodar.
 */
const PAYLOAD_BASE64URL = 'eyJ1c3VhcmlvSWQiOjEwLCJub21lIjoiSm_Do28iLCJzdWIiOiJ1c2VyMTBAZXhlbXBsby5jb20ifQ'

describe('decodeJwtPayload', () => {
  it('decodifica um payload cujo base64 contem caracteres exclusivos do base64url (- ou _)', () => {
    const token = `header.${PAYLOAD_BASE64URL}.signature`

    const claims = decodeJwtPayload<ClaimsToken>(token)

    expect(claims).toEqual({ usuarioId: 10, nome: 'João', sub: 'user10@exemplo.com' })
  })

  it('decodifica corretamente independente do padding (base64url nao usa "=")', () => {
    // "eyJhIjoxfQ" (7 bytes) decodifica pra {"a":1} e precisa de padding pra virar base64 valido
    const token = `header.eyJhIjoxfQ.signature`

    expect(decodeJwtPayload<{ a: number }>(token)).toEqual({ a: 1 })
  })

  it('lanca um erro claro quando o token nao tem o segmento de payload', () => {
    expect(() => decodeJwtPayload('apenas-header')).toThrow('Token JWT malformado')
  })
})
