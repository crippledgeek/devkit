import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { POPULAR_ENCODINGS } from '@/lib/encoding'
import { getErrorMessage } from '@/lib/errors'
import type { ConverterConfig, SelectOption } from '@/lib/converter-configs'

interface FieldMetaLike {
    errors?: unknown[]
}

export function useConverterForm<T extends { mode: string }>(
    config: ConverterConfig<T>,
) {
    const [output, setOutput] = useState('')

    const form = useForm({
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

    // Reactively read mode — triggers re-render only when mode changes
    const mode = useStore(form.store, (state) => state.values.mode)

    // Clear output and reset input when mode changes
    const prevModeRef = useRef(mode)
    useEffect(() => {
        if (mode !== prevModeRef.current) {
            prevModeRef.current = mode
            setOutput('')
            form.setFieldValue('input' as never, '' as never)
        }
    }, [mode, form])

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
        encodingOptions,
        registerInputRef,
        focusFirstError,
    }
}
