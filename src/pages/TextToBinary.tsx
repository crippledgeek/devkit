import { Binary, isValidEncoding } from '@/lib/encoding'
import { FormButton, FormSelect, FormTextArea } from '@/components/form'
import { useConverterForm } from '@/hooks/useConverterForm'
import { binaryConverterSchema, type BinaryConverterForm } from '@/lib/validation-schemas'
import { formatFieldErrors } from '@/lib/errors'

export default function TextBinaryConverter() {
    const { fromText, toText } = Binary

    const { form, output, setOutput, handleReset, encodingOptions } = useConverterForm<BinaryConverterForm>({
        validationSchema: { onChange: binaryConverterSchema },
        defaultValues: {
            mode: 'encode',
            encoding: 'utf8',
            delimiter: ' ',
            input: '',
        },
        onSubmit: async (value) => {
            const { mode, encoding, delimiter, input } = value
            const enc = isValidEncoding(encoding) ? encoding : 'utf8'

            const result = mode === 'decode'
                ? await toText(input, { encoding: enc, delimiter })
                : await fromText(input, { encoding: enc, delimiter })

            setOutput(result)
        },
    })

    const delimiterOptions = [
        { value: ' ', label: 'Space' },
        { value: '', label: 'None' },
        { value: '-', label: 'Dash' },
        { value: ',', label: 'Comma' },
    ]

    const inputLabel = form.state.values.mode === 'decode' ? 'Binary input' : 'Text input'
    const outputLabel = form.state.values.mode === 'decode' ? 'Text output' : 'Binary output'

    const showFieldError = (meta: {
        isTouched?: boolean
        touchedErrors?: unknown[]
        errors?: unknown[]
    }) => {
        const shouldShow = meta.isTouched || form.state.isSubmitted
        const errs = (meta.touchedErrors?.length ? meta.touchedErrors : meta.errors) ?? []
        return shouldShow && errs.length > 0 ? (
            <em className="text-red-500 text-sm">{formatFieldErrors(errs)}</em>
        ) : null
    }

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
                    {(field) => {
                        const handleChange = (value: string) => {
                            field.setValue(value as BinaryConverterForm['mode'])
                        }
                        return (
                            <>
                                <FormSelect
                                    name="mode"
                                    label="Mode"
                                    value={field.state.value}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'encode', label: 'Encode (Text → Binary)' },
                                        { value: 'decode', label: 'Decode (Binary → Text)' },
                                    ]}
                                />
                                {showFieldError(field.state.meta)}
                            </>
                        )
                    }}
                </form.Field>

                <form.Field name="encoding">
                    {(field) => (
                        <>
                            <FormSelect
                                name="encoding"
                                label="Character encoding"
                                value={field.state.value}
                                onChange={(value) => field.setValue(value)}
                                options={encodingOptions}
                            />
                            {showFieldError(field.state.meta)}
                        </>
                    )}
                </form.Field>

                <form.Field name="delimiter">
                    {(field) => (
                        <>
                            <FormSelect
                                name="delimiter"
                                label="Delimiter"
                                value={field.state.value}
                                onChange={(value) => field.setValue(value)}
                                options={delimiterOptions}
                            />
                            {showFieldError(field.state.meta)}
                        </>
                    )}
                </form.Field>

                <form.Field name="input">
                    {(field) => (
                        <>
                            <FormTextArea
                                name="input"
                                label={inputLabel}
                                placeholder={form.state.values.mode === 'decode' ? 'Enter binary groups e.g. 01001000 01100101' : 'Enter text...'}
                                isRequired
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e)}
                                className={form.state.values.mode === 'decode' ? 'font-mono' : undefined}
                            />
                            {showFieldError(field.state.meta)}
                        </>
                    )}
                </form.Field>

                <div className="flex gap-2">
                    <FormButton type="button" variant="secondary" onPress={handleReset}>
                        Reset
                    </FormButton>
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <FormButton
                                type="submit"
                                isDisabled={!canSubmit || isSubmitting}
                            >
                                {isSubmitting ? 'Converting...' : 'Convert'}
                            </FormButton>
                        )}
                    />
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
