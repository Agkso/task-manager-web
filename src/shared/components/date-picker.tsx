import { useState, type ChangeEvent } from 'react'
import { format, isValid, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

const FORMATO_EXIBICAO = 'dd/MM/yyyy'

/**
 * yyyy-MM-dd a partir das partes locais da data, nao Date.toISOString()
 * (que converte pra UTC - um dia selecionado a meia-noite local em fuso
 * negativo, ex. UTC-3, viraria o dia anterior depois da conversao).
 */
function paraIsoLocal(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

/**
 * value/onChange em string ISO (yyyy-MM-dd) - mesmo contrato do input
 * type=date que ele substitui. Digitar (dd/mm/aaaa) e escolher no calendario
 * (com dropdown de mes/ano, nao so setinha de +-1 mes - bom pra prazos longe
 * do mes atual) atualizam o mesmo estado. Digitar so propaga pro formulario
 * quando o texto vira uma data valida e completa, pra nao disparar onChange
 * a cada tecla com data incompleta.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  id,
}: {
  value: string
  onChange: (valor: string) => void
  placeholder?: string
  id?: string
}) {
  const dataSelecionada = value ? new Date(`${value}T00:00:00`) : undefined
  const textoParaValue = dataSelecionada ? format(dataSelecionada, FORMATO_EXIBICAO) : ''

  const [texto, setTexto] = useState(textoParaValue)
  const [aberto, setAberto] = useState(false)
  // guarda o ultimo `value` (prop) que gerou o `texto` exibido - se o pai
  // mudar o value por fora (selecao no calendario, reset de formulario),
  // percebemos aqui no render e resincronizamos o texto digitado, sem useEffect
  // (que rodaria depois do commit e causaria um re-render em cascata).
  const [ultimoValueSincronizado, setUltimoValueSincronizado] = useState(value)

  if (value !== ultimoValueSincronizado) {
    setUltimoValueSincronizado(value)
    setTexto(textoParaValue)
  }

  function aoDigitar(evento: ChangeEvent<HTMLInputElement>) {
    const novoTexto = evento.target.value
    setTexto(novoTexto)

    if (novoTexto === '') {
      onChange('')
      return
    }

    if (novoTexto.length === FORMATO_EXIBICAO.length) {
      const dataDigitada = parse(novoTexto, FORMATO_EXIBICAO, new Date())
      if (isValid(dataDigitada)) {
        onChange(paraIsoLocal(dataDigitada))
      }
    }
  }

  function aoSelecionarNoCalendario(data: Date | undefined) {
    onChange(data ? paraIsoLocal(data) : '')
    setAberto(false)
  }

  return (
    <div className="flex gap-1.5">
      <Input
        id={id}
        value={texto}
        onChange={aoDigitar}
        placeholder={placeholder}
        inputMode="numeric"
        autoComplete="off"
      />
      <Popover open={aberto} onOpenChange={setAberto}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" aria-label="Abrir calendario">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            locale={ptBR}
            selected={dataSelecionada}
            onSelect={aoSelecionarNoCalendario}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
