import { FormButton } from './FormButton'
import { useFormContext } from '@/hooks/form'

interface ConvertActionsProps {
    onReset: () => void
}

export function ConvertActions({ onReset }: ConvertActionsProps) {
    const form = useFormContext()

    return (
        <div className="flex gap-2">
            <FormButton type="button" variant="secondary" onPress={onReset}>
                Reset
            </FormButton>
            <form.Subscribe
                selector={(state: { canSubmit: boolean; isSubmitting: boolean }) => [
                    state.canSubmit,
                    state.isSubmitting,
                ]}
            >
                {([canSubmit, isSubmitting]) => (
                    <FormButton
                        type="submit"
                        isDisabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? 'Converting...' : 'Convert'}
                    </FormButton>
                )}
            </form.Subscribe>
        </div>
    )
}
