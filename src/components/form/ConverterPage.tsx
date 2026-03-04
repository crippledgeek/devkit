import { useStore } from '@tanstack/react-form'
import { useConverterForm } from '@/hooks/useConverterForm'
import type { ConverterConfig, ConverterFormBase, SelectOption } from '@/lib/converter-configs'
import { FormTextArea } from './FormTextArea'

interface ConverterPageProps<T extends ConverterFormBase> {
    config: ConverterConfig<T>
}

export function ConverterPage<T extends ConverterFormBase>({
    config,
}: ConverterPageProps<T>) {
    const {
        form,
        output,
        handleReset,
        handleModeChange,
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
                {config.fields.map((field) => {
                    // Conditional visibility
                    const visible = !field.visibleWhen || field.visibleWhen(
                        form.state.values,
                    )
                    if (!visible) return null

                    // Resolve dynamic properties
                    const resolvedLabel = field.isInput
                        ? config.inputLabel(mode)
                        : field.label
                    const resolvedPlaceholder =
                        typeof field.placeholder === 'function'
                            ? field.placeholder(mode)
                            : field.placeholder
                    const resolvedClassName =
                        typeof field.className === 'function'
                            ? field.className(mode)
                            : field.className

                    if (field.type === 'select') {
                        const resolvedOptions: SelectOption[] =
                            field.options === 'encodings'
                                ? encodingOptions
                                : (field.options ?? [])

                        return (
                            <form.AppField
                                key={field.name}
                                name={field.name}
                                listeners={field.name === 'mode' ? {
                                    onChange: handleModeChange,
                                } : undefined}
                            >
                                {(fieldApi) => (
                                    <fieldApi.SelectField
                                        label={resolvedLabel}
                                        options={resolvedOptions}
                                    />
                                )}
                            </form.AppField>
                        )
                    }

                    // textarea
                    return (
                        <form.AppField key={field.name} name={field.name}>
                            {(fieldApi) => (
                                <fieldApi.TextAreaField
                                    label={resolvedLabel}
                                    placeholder={resolvedPlaceholder}
                                    rows={field.rows}
                                    className={resolvedClassName}
                                    registerRef={field.isInput ? registerInputRef : undefined}
                                />
                            )}
                        </form.AppField>
                    )
                })}

                <form.AppForm>
                    <form.ConvertActions onReset={handleReset} />
                </form.AppForm>

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
