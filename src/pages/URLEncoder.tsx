import { URLEncode, isValidEncoding } from '@/lib/encoding'
import { FieldErrorMessage, FormButton, FormSelect, FormTextArea } from '@/components/form'
import { useConverterForm } from '@/hooks/useConverterForm'
import { useFormHelpers } from '@/hooks/useFormHelpers'
import { urlEncoderSchema, type URLEncoderForm } from '@/lib/validation-schemas'

export default function URLEncoder() {
    const { form, output, setOutput, handleReset, encodingOptions } = useConverterForm<URLEncoderForm>({
        validationSchema: { onChange: urlEncoderSchema },
        defaultValues: {
            mode: 'encode',
            encoding: 'utf8',
            encodingMode: 'component',
            input: '',
        },
        onSubmit: async (value) => {
            const { mode, encoding, encodingMode, input } = value
            const enc = isValidEncoding(encoding) ? encoding : 'utf8'

            const result = mode === 'decode'
                ? await URLEncode.decode(input, { mode: encodingMode, encoding: enc })
                : await URLEncode.encode(input, { mode: encodingMode, encoding: enc })

            setOutput(result)
        },
    })

    const { registerInputRef, focusFirstError } = useFormHelpers(form)

    const inputLabel = form.state.values.mode === 'decode' ? 'URL-encoded input' : 'Text input'
    const outputLabel = form.state.values.mode === 'decode' ? 'Decoded output' : 'URL-encoded output'

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">URL Encoder/Decoder</h1>
            <p className="text-muted-foreground mb-6">
                Encode or decode URL strings. Choose between component encoding (for query parameters) or full URL encoding.
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                    focusFirstError()
                }}
                className="flex flex-col gap-6"
            >
                <form.Field name="mode">
                    {(field) => {
                        const handleChange = (value: string) => {
                            field.setValue(value as URLEncoderForm['mode'])
                        }
                        return (
                            <>
                                <FormSelect
                                    name="mode"
                                    label="Mode"
                                    value={field.state.value}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'encode', label: 'Encode (Text → URL)' },
                                        { value: 'decode', label: 'Decode (URL → Text)' },
                                    ]}
                                />
                                <FieldErrorMessage
                                    meta={field.state.meta}
                                    showWhenSubmitted={form.state.isSubmitted}
                                />
                            </>
                        )
                    }}
                </form.Field>

                <form.Field name="encoding">
                    {(field) => (
                        <>
                            <FormSelect
                                name="encoding"
                                label="Character Encoding"
                                value={field.state.value}
                                onChange={field.handleChange}
                                options={encodingOptions}
                            />
                            <FieldErrorMessage
                                meta={field.state.meta}
                                showWhenSubmitted={form.state.isSubmitted}
                            />
                        </>
                    )}
                </form.Field>

                <form.Field name="encodingMode">
                    {(field) => {
                        const handleChange = (value: string) => {
                            field.setValue(value as URLEncoderForm['encodingMode'])
                        }
                        return (
                            <>
                                <FormSelect
                                    name="encodingMode"
                                    label="Encoding Mode"
                                    value={field.state.value}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'component', label: 'Component (for query params, encodes more characters)' },
                                        { value: 'full', label: 'Full URL (preserves :/?#[]@!$&\'()*+,;=)' },
                                    ]}
                                />
                                <FieldErrorMessage
                                    meta={field.state.meta}
                                    showWhenSubmitted={form.state.isSubmitted}
                                />
                            </>
                        )
                    }}
                </form.Field>

                <form.Field name="input">
                    {(field) => (
                        <>
                            <FormTextArea
                                ref={registerInputRef('input')}
                                name="input"
                                label={inputLabel}
                                value={field.state.value}
                                onChange={(value) => field.handleChange(value)}
                                placeholder={
                                    form.state.values.mode === 'decode'
                                        ? 'Enter URL-encoded text (e.g., Hello%20World)'
                                        : 'Enter text to encode (e.g., Hello World)'
                                }
                                rows={6}
                            />
                            <FieldErrorMessage
                                meta={field.state.meta}
                                showWhenSubmitted={form.state.isSubmitted}
                            />
                        </>
                    )}
                </form.Field>

                <div className="flex gap-3">
                    <FormButton type="button" variant="secondary" onPress={handleReset}>
                        Reset
                    </FormButton>
                    <FormButton type="submit">
                        Convert
                    </FormButton>
                </div>

                {output && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">{outputLabel}</label>
                        <textarea
                            readOnly
                            value={output}
                            className="w-full p-3 border rounded-md bg-muted font-mono text-sm min-h-[150px]"
                        />
                    </div>
                )}
            </form>
        </div>
    )
}

