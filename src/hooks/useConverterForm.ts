import { useForm } from '@tanstack/react-form'
import { useEffect, useState } from 'react'
import { POPULAR_ENCODINGS } from '@/lib/encoding'

interface UseConverterFormOptions<T> {
    defaultValues: T
    onSubmit: (values: T) => Promise<void>
}

export function useConverterForm<T extends { mode: string }>({
                                                                 defaultValues,
                                                                 onSubmit,
                                                             }: UseConverterFormOptions<T>) {
    const [output, setOutput] = useState('')

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            try {
                await onSubmit(value)
            } catch (error) {
                console.error('Conversion error:', error)
                setOutput('Error: Invalid input')
            }
        },
    })

    // Clear output when mode changes
    useEffect(() => {
        const prevModeRef = { current: form.state.values.mode }
        return form.store.subscribe(() => {
            const nextMode = form.state.values.mode
            if (nextMode !== prevModeRef.current) {
                prevModeRef.current = nextMode
                setOutput('')
            }
        })
    }, [form])

    const handleReset = () => {
        form.reset()
        setOutput('')
    }

    const encodingOptions = POPULAR_ENCODINGS.map(enc => ({
        value: enc,
        label: enc.toUpperCase()
    }))

    return {
        form,
        output,
        setOutput,
        handleReset,
        encodingOptions,
    }
}