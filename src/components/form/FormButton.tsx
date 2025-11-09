import { Button as JollyButton } from "@/components/ui/button"
import type { ButtonProps as JollyButtonProps } from "@/components/ui/button"
import type {ReactNode} from "react"

interface FormButtonProps {
    type?: "submit" | "button" | "reset"
    variant?: "primary" | "secondary" | "outline"
    onPress?: () => void
    isDisabled?: boolean
    children: ReactNode
}

function mapVariant(variant: FormButtonProps["variant"]): JollyButtonProps["variant"] {
    switch (variant) {
        case "secondary":
            return "secondary"
        case "outline":
            return "outline"
        case "primary":
        default:
            return "default"
    }
}

export function FormButton({
                               type = "button",
                               variant = "primary",
                               onPress,
                               isDisabled = false,
                               children
                           }: FormButtonProps) {
    const mappedVariant = mapVariant(variant)
    return (
        <JollyButton
            type={type}
            variant={mappedVariant}
            onPress={onPress}
            isDisabled={isDisabled}
        >
            {children}
        </JollyButton>
    )
}