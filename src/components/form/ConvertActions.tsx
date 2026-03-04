import { FormButton } from './FormButton'

interface ConvertActionsProps {
    /** TanStack React Form instance (ReactFormExtendedApi) */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
    onReset: () => void
}

export function ConvertActions({ form, onReset }: ConvertActionsProps) {
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
                {([canSubmit, isSubmitting]: [boolean, boolean]) => (
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
