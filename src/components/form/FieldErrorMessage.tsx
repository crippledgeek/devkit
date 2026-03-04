import { formatFieldErrors } from '@/lib/errors'

interface FieldErrorMessageProps {
    meta: { isTouched?: boolean; isBlurred?: boolean; errors?: unknown[] }
    showWhenSubmitted: boolean
}

export function FieldErrorMessage({ meta, showWhenSubmitted }: FieldErrorMessageProps) {
    const shouldShow = meta.isTouched || meta.isBlurred || showWhenSubmitted
    const errs = meta.errors ?? []
    return shouldShow && errs.length > 0 ? (
        <em className="text-red-500 text-sm">{formatFieldErrors(errs)}</em>
    ) : null
}
