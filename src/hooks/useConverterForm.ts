import { useCallback, useMemo, useRef, useState } from 'react'
import { POPULAR_ENCODINGS } from '@/lib/encoding'
import { getErrorMessage } from '@/lib/errors'
import { useAppForm } from '@/hooks/form'
import type { ConverterConfig, ConverterFormBase, SelectOption } from '@/lib/converter-configs'

interface FieldMetaLike {
    errors?: unknown[]
}

export function useConverterForm<T extends ConverterFormBase>(
    config: ConverterConfig<T>,
) {
    const [output, setOutput] = useState('')

    const form = useAppForm({
        defaultValues: config.defaultValues,
        validators: { onChange: config.schema },
        onSubmit: async ({ value }) => {
            try {
                setOutput('')
                const result = await config.onSubmit(value)
                setOutput(result)
            } catch (error) {
                const errorMessage = getErrorMessage(error)
                setOutput(`Error: ${errorMessage}`)

                if (import.meta.env.DEV) {
                    console.error('Conversion error:', error)
                }
            }
        },
    })

    // Clear output and reset input — used as a field listener for mode changes
    const handleModeChange = useCallback(() => {
        setOutput('')
        form.setFieldValue('input' as never, '' as never)
    }, [form])

    // -----------------------------------------------------------------------
    // Focus management (absorbed from useFormHelpers)
    // -----------------------------------------------------------------------

    const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({})

    const registerInputRef = useCallback(
        (name: string) =>
            (el: HTMLInputElement | HTMLTextAreaElement | null): void => {
                inputRefs.current[name] = el
            },
        [],
    )

    const focusFirstError = useCallback((): void => {
        const fieldMeta = form.state.fieldMeta as Record<string, FieldMetaLike>
        const firstBad = Object.entries(fieldMeta).find(
            ([, meta]) => (meta.errors?.length ?? 0) > 0,
        )
        if (firstBad) {
            const [name] = firstBad
            inputRefs.current[name]?.focus()
        }
    }, [form.state.fieldMeta])

    // -----------------------------------------------------------------------
    // Callbacks
    // -----------------------------------------------------------------------

    const handleReset = useCallback(() => {
        form.reset()
        setOutput('')
    }, [form])

    // -----------------------------------------------------------------------
    // Encoding options
    // -----------------------------------------------------------------------

    const encodingOptions: SelectOption[] = useMemo(
        () =>
            POPULAR_ENCODINGS.map((enc) => ({
                value: enc,
                label: enc.toUpperCase(),
            })),
        [],
    )

    return {
        form,
        output,
        handleReset,
        handleModeChange,
        encodingOptions,
        registerInputRef,
        focusFirstError,
    }
}
