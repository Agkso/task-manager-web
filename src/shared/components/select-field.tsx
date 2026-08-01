import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  className,
}: {
  id?: string
  label?: string
  value: T
  onChange: (valor: T) => void
  options: { value: T; label: string }[]
  className?: string
}) {
  return (
    <div className={className ? className : 'flex flex-col gap-2'}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opcao) => (
            <SelectItem key={opcao.value} value={opcao.value}>
              {opcao.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
