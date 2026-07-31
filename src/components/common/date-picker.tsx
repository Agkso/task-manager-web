import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

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

/** value/onChange em string ISO (yyyy-MM-dd) - mesmo contrato que o input type=date que ele substitui. */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Selecionar data',
  id,
}: {
  value: string
  onChange: (valor: string) => void
  placeholder?: string
  id?: string
}) {
  const dataSelecionada = value ? new Date(`${value}T00:00:00`) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn('justify-start font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="h-4 w-4" />
          {dataSelecionada
            ? dataSelecionada.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dataSelecionada}
          onSelect={(data) => onChange(data ? paraIsoLocal(data) : '')}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
