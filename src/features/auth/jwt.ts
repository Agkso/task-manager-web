/**
 * JWT usa base64url (RFC 7515: '-'/'_' no lugar de '+'/'/', sem padding '='),
 * nao base64 padrao - atob() sozinho lanca DOMException em qualquer payload
 * cujo base64 contenha esses caracteres (comum, nao um caso raro). Esse era
 * o bug real por tras de "login nunca avança pra home": decodificarUsuario
 * lancava dentro do setSessao(), antes do navigate('/projetos') rodar.
 *
 * atob() tambem devolve uma "binary string" (1 char = 1 byte), nao texto
 * UTF-8 decodificado - direto no JSON.parse, qualquer nome com acento (comum
 * nesse app, ex.: "João", "Conceição") vira mojibake na UI. Por isso o passo
 * extra de reinterpretar os bytes como UTF-8 via TextDecoder antes do parse.
 */
export function decodeJwtPayload<T>(token: string): T {
  const [, payloadBase64Url] = token.split('.')
  if (!payloadBase64Url) {
    throw new Error('Token JWT malformado: faltando segmento de payload')
  }

  const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
  const comPadding = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

  const bytes = Uint8Array.from(atob(comPadding), (char) => char.charCodeAt(0))
  const json = new TextDecoder('utf-8').decode(bytes)

  return JSON.parse(json) as T
}
