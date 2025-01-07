import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputWithLabel({ inputId, inputType, label, inputPlaceholder, className }: InputWithLabelProps) {

    return (
      <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
        <Label htmlFor={inputId}>{label}</Label>
        <Input type={inputType} id={inputId} placeholder={inputPlaceholder} />
      </div>
    );
}
