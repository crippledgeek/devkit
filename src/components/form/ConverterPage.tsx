import { useStore } from '@tanstack/react-form'
import { useConverterForm } from '@/hooks/useConverterForm'
import type { ConverterConfig, FieldConfig, SelectOption } from '@/lib/converter-configs'
import { SelectField } from './SelectField'
import { TextAreaField } from './TextAreaField'
import { ConvertActions } from './ConvertActions'
import { FormTextArea } from './FormTextArea'

interface ConverterPageProps<T> {
    config: ConverterConfig<T>
}

export function ConverterPage<T extends { mode: string }>({
    config,
}: ConverterPageProps<T>) {
    const {
        form,
        output,
        handleReset,
        encodingOptions,
        registerInputRef,
        focusFirstError,
    } = useConverterForm(config)

    // Selective subscription: only re-render when mode changes
    const mode: string = useStore(form.store, (state) => state.values.mode)

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
            <p className="text-muted-foreground mb-6">{config.description}</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                    focusFirstError()
                }}
                className="flex flex-col gap-6"
            >
                {config.fields.map((field) => (
                    <FieldRenderer
                        key={field.name}
                        field={field}
                        form={form}
                        mode={mode}
                        encodingOptions={encodingOptions}
                        registerInputRef={registerInputRef}
                        inputLabel={config.inputLabel(mode)}
                    />
                ))}

                <ConvertActions form={form} onReset={handleReset} />

                {output && (
                    <FormTextArea
                        name="output"
                        label={config.outputLabel(mode)}
                        value={output}
                        readOnly
                        className="font-mono"
                    />
                )}
            </form>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Internal field renderer
// ---------------------------------------------------------------------------

interface FieldRendererProps {
    field: FieldConfig
    /** TanStack React Form instance (ReactFormExtendedApi) */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
    mode: string
    encodingOptions: SelectOption[]
    registerInputRef: (name: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => void
    inputLabel: string
}

function FieldRenderer({
    field,
    form,
    mode,
    encodingOptions,
    registerInputRef,
    inputLabel,
}: FieldRendererProps) {
    // Conditional visibility
    if (field.visibleWhen) {
        const values = form.state.values as Record<string, unknown>
        if (!field.visibleWhen(values)) return null
    }

    // Resolve dynamic properties
    const resolvedLabel = field.isInput ? inputLabel : field.label
    const resolvedPlaceholder =
        typeof field.placeholder === 'function' ? field.placeholder(mode) : field.placeholder
    const resolvedClassName =
        typeof field.className === 'function' ? field.className(mode) : field.className

    if (field.type === 'select') {
        const resolvedOptions: SelectOption[] =
            field.options === 'encodings' ? encodingOptions : (field.options ?? [])

        return (
            <SelectField
                form={form}
                name={field.name}
                label={resolvedLabel}
                options={resolvedOptions}
            />
        )
    }

    // textarea
    return (
        <TextAreaField
            form={form}
            name={field.name}
            label={resolvedLabel}
            placeholder={resolvedPlaceholder}
            rows={field.rows}
            className={resolvedClassName}
            registerRef={field.isInput ? registerInputRef : undefined}
        />
    )
}
