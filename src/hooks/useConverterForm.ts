import { useForm } from '@tanstack/react-form'
import { useEffect, useState, useRef, useMemo } from 'react'
import { POPULAR_ENCODINGS } from '@/lib/encoding'
import { getErrorMessage } from '@/lib/errors'

interface UseConverterFormOptions<T> {
    defaultValues: T
    validationSchema?: any
    onSubmit: (values: T) => Promise<void>
}

export function useConverterForm<T extends { mode: string }>({
                                                                 defaultValues,
                                                                 validationSchema,
                                                                 onSubmit,
                                                             }: UseConverterFormOptions<T>) {
    const [output, setOutput] = useState('')

    const form = useForm({
        defaultValues,
        validators: validationSchema,
        onSubmit: async ({ value }) => {
            try {
                setOutput('') // Clear previous output

                await onSubmit(value)
            } catch (error) {
                const errorMessage = getErrorMessage(error)
                setOutput(`Error: ${errorMessage}`)

                // Only log detailed errors in development
                if (import.meta.env.DEV) {
                    console.error('Conversion error:', error)
                }
            }
        },
    })

    // Clear output when mode changes (fixed memory leak)
    const prevModeRef = useRef(form.state.values.mode)

    useEffect(() => {
        const unsubscribe = form.store.subscribe(() => {
            const nextMode = form.state.values.mode
            if (nextMode !== prevModeRef.current) {
                prevModeRef.current = nextMode
                setOutput('')
            }
        })
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.store])

    const handleReset = () => {
        form.reset()
        setOutput('')
    }

    // Memoize encoding options to avoid recreating on every render
    const encodingOptions = useMemo(
        () => POPULAR_ENCODINGS.map(enc => ({
            value: enc,
            label: enc.toUpperCase()
        })),
        []
    )

    return {
        form,
        output,
        setOutput,
        handleReset,
        encodingOptions,
    }
}