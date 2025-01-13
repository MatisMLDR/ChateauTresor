import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPWithDash() {
    return (
        <InputOTP pattern={"^\\d+$"} maxLength={6}>
            <InputOTPGroup className={"text-secondary border-primary"}>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className={"text-secondary"} />
            <InputOTPGroup className={"text-secondary border-primary"}>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
            </InputOTPGroup>
        </InputOTP>
    )
}