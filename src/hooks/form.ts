import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { SelectField } from '@/components/form/SelectField'
import { TextAreaField } from '@/components/form/TextAreaField'
import { ConvertActions } from '@/components/form/ConvertActions'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
    createFormHookContexts()

export const { useAppForm } = createFormHook({
    fieldComponents: {
        SelectField,
        TextAreaField,
    },
    formComponents: {
        ConvertActions,
    },
    fieldContext,
    formContext,
})
