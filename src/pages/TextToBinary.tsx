import {Binary, isValidEncoding, POPULAR_ENCODINGS} from '@/lib/encoding'
import {useEffect, useState} from 'react'
import {FormButton, FormSelect, FormTextArea} from '@/components/form'
import {useForm} from '@tanstack/react-form'

export default function TextBinaryConverter() {
    const [output, setOutput] = useState('')

    const { fromText, toText } = Binary

    const form = useForm({
        defaultValues: {
            mode: 'encode',
            encoding: 'utf8',
            delimiter: ' ',
            input: '',
        },
        onSubmit: async ({ value }) => {
            try {
                const { mode, encoding, delimiter, input } = value
                const enc = isValidEncoding(encoding) ? encoding : 'utf8'

                const result = mode === 'decode'
                    ? await toText(input, { encoding: enc, delimiter })
                    : await fromText(input, { encoding: enc, delimiter })

                setOutput(result)
            } catch (error) {
                console.error('Conversion error:', error)
                setOutput('Error: Invalid input')
            }
        },
    })

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

    const delimiterOptions = [
        { value: ' ', label: 'Space' },
        { value: '', label: 'None' },
        { value: '-', label: 'Dash' },
        { value: ',', label: 'Comma' },
    ]

    const inputLabel = form.state.values.mode === 'decode' ? 'Binary input' : 'Text input'
    const outputLabel = form.state.values.mode === 'decode' ? 'Text output' : 'Binary output'

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Text ↔ Binary Converter</h1>
            <p className="text-muted-foreground mb-6">
                Convert between text and binary. Choose mode, encoding, and delimiter.
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="flex flex-col gap-6"
            >
                <form.Field name="mode">
                    {(field) => (
                        <FormSelect
                            name="mode"
                            label="Mode"
                            value={field.state.value}
                            onChange={(value) => field.handleChange(String(value))}
                            options={[
                                { value: 'encode', label: 'Encode (Text → Binary)' },
                                { value: 'decode', label: 'Decode (Binary → Text)' },
                            ]}
                        />
                    )}
                </form.Field>

                <form.Field name="encoding">
                    {(field) => (
                        <FormSelect
                            name="encoding"
                            label="Character encoding"
                            value={field.state.value}
                            onChange={field.handleChange}
                            options={encodingOptions}
                        />
                    )}
                </form.Field>

                <form.Field name="delimiter">
                    {(field) => (
                        <FormSelect
                            name="delimiter"
                            label="Delimiter"
                            value={field.state.value}
                            onChange={field.handleChange}
                            options={delimiterOptions}
                        />
                    )}
                </form.Field>

                <form.Field name="input">
                    {(field) => (
                        <FormTextArea
                            name="input"
                            label={inputLabel}
                            placeholder={form.state.values.mode === 'decode' ? 'Enter binary groups e.g. 01001000 01100101' : 'Enter text...'}
                            isRequired
                            value={field.state.value}
                            onChange={(val) => field.handleChange(val)}
                            className={form.state.values.mode === 'decode' ? 'font-mono' : undefined}
                        />
                    )}
                </form.Field>

                <div className="flex gap-2">
                    <FormButton type="submit">Convert</FormButton>
                    <FormButton type="button" variant="secondary" onPress={handleReset}>
                        Reset
                    </FormButton>
                </div>

                {output && (
                    <FormTextArea
                        name="output"
                        label={outputLabel}
                        value={output}
                        readOnly
                        className="font-mono"
                    />
                )}
            </form>
        </div>
    )
}