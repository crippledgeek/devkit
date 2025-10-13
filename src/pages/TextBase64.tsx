import { Base64, isValidEncoding } from '@/lib/encoding'
import { FormButton, FormSelect, FormTextArea } from '@/components/form'
import { useConverterForm } from '@/hooks/useConverterForm'

export default function TextBase64Converter() {
    const { encode, decode } = Base64

    const { form, output, setOutput, handleReset, encodingOptions } = useConverterForm({
        defaultValues: {
            mode: 'encode',
            encoding: 'utf8',
            input: '',
        },
        onSubmit: async (value) => {
            const { mode, encoding, input } = value
            const enc = isValidEncoding(encoding) ? encoding : 'utf8'

            const result = mode === 'decode'
                ? await decode(input, { encoding: enc })
                : await encode(input, { encoding: enc })

            setOutput(result)
        },
    })

    const inputLabel = form.state.values.mode === 'decode' ? 'Base64 input' : 'Text input'
    const outputLabel = form.state.values.mode === 'decode' ? 'Text output' : 'Base64 output'
    const inputPlaceholder = form.state.values.mode === 'decode'
        ? 'Enter Base64 string e.g. SGVsbG8gV29ybGQ='
        : 'Enter text...'

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Text ↔ Base64 Converter</h1>
            <p className="text-muted-foreground mb-6">
                Convert between text and Base64. Choose mode and encoding.
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
                            onChange={field.handleChange}
                            options={[
                                { value: 'encode', label: 'Encode (Text → Base64)' },
                                { value: 'decode', label: 'Decode (Base64 → Text)' },
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

                <form.Field name="input">
                    {(field) => (
                        <FormTextArea
                            name="input"
                            label={inputLabel}
                            placeholder={inputPlaceholder}
                            isRequired
                            value={field.state.value}
                            onChange={field.handleChange}
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