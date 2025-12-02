import {useEffect, useRef} from 'react'

interface FieldMetaLike {
    errors?: unknown[]
}

/**
 * Helper hook for TanStack Form mode-change handling and focus management
 */
export function useFormHelpers<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TFormData extends Record<string, any>
>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
) {
    // Keep refs to input / textarea elements
    const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({})

    // Keep track of previous mode to detect changes
    const prevModeRef = useRef(form.state.values.mode)

    // Reset "input" field whenever mode changes
    useEffect(() => {
        return form.store.subscribe(() => {
            const nextMode = form.state.values.mode
            if (nextMode !== prevModeRef.current) {
                prevModeRef.current = nextMode
                form.setFieldValue('input', '')
                form.resetFieldMeta?.('input')
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.store])

    // Register field refs in JSX:  ref={registerInputRef('input')}
    const registerInputRef =
        (name: keyof TFormData & string) =>
            (el: HTMLInputElement | HTMLTextAreaElement | null): void => {
                inputRefs.current[name] = el
            }

    // Focus the first invalid field after submit
    const focusFirstError = (): void => {
        const fieldMeta = form.state.fieldMeta as Record<string, FieldMetaLike>
        const firstBad = Object.entries(fieldMeta).find(
            ([, meta]) => (meta.errors?.length ?? 0) > 0
        )
        if (firstBad) {
            const [name] = firstBad
            inputRefs.current[name]?.focus()
        }
    }

    return { inputRefs, registerInputRef, focusFirstError }
}
