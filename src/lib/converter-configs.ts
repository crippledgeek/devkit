import type { ZodType } from 'zod'
import { Binary, Base64, Hex, URLEncode, isValidEncoding } from '@/lib/encoding'
import {
    binaryConverterSchema,
    base64ConverterSchema,
    hexConverterSchema,
    urlEncoderSchema,
    type BinaryConverterForm,
    type Base64ConverterForm,
    type HexConverterForm,
    type URLEncoderForm,
} from '@/lib/validation-schemas'

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface SelectOption {
    value: string
    label: string
}

export interface FieldConfig {
    /** Field name — must match a key in the form's default values */
    name: string
    /** Render type */
    type: 'select' | 'textarea'
    /** Label text (static) */
    label: string
    /** Options for select fields; 'encodings' resolves to the encoding list at render time */
    options?: SelectOption[] | 'encodings'
    /** Textarea row count */
    rows?: number
    /** Static or mode-dependent placeholder */
    placeholder?: string | ((mode: string) => string)
    /** Show this field only when the predicate returns true */
    visibleWhen?: (values: Record<string, unknown>) => boolean
    /** Marks this field as the primary input (receives registerInputRef and dynamic label) */
    isInput?: boolean
    /** Static or mode-dependent className */
    className?: string | ((mode: string) => string | undefined)
}

export interface ConverterConfig<T> {
    /** Page heading */
    title: string
    /** Page sub-heading */
    description: string
    /** Zod schema for form-level validation */
    schema: ZodType
    /** TanStack Form default values */
    defaultValues: T
    /** Ordered list of form fields */
    fields: FieldConfig[]
    /** Conversion logic — returns the result string */
    onSubmit: (values: T) => Promise<string>
    /** Dynamic label for the primary input field */
    inputLabel: (mode: string) => string
    /** Dynamic label for the output area */
    outputLabel: (mode: string) => string
}

// ---------------------------------------------------------------------------
// Mode options shared across all converters
// ---------------------------------------------------------------------------

function modeOptions(encodeName: string, decodeName: string): SelectOption[] {
    return [
        { value: 'encode', label: `Encode (Text \u2192 ${encodeName})` },
        { value: 'decode', label: `Decode (${decodeName} \u2192 Text)` },
    ]
}

// ---------------------------------------------------------------------------
// Binary converter config
// ---------------------------------------------------------------------------

export const binaryConverterConfig: ConverterConfig<BinaryConverterForm> = {
    title: 'Text \u2194 Binary Converter',
    description: 'Convert between text and binary. Choose mode, encoding, and delimiter.',
    schema: binaryConverterSchema,
    defaultValues: {
        mode: 'encode',
        encoding: 'utf8',
        delimiter: ' ',
        input: '',
    },
    fields: [
        {
            name: 'mode',
            type: 'select',
            label: 'Mode',
            options: modeOptions('Binary', 'Binary'),
        },
        {
            name: 'encoding',
            type: 'select',
            label: 'Character encoding',
            options: 'encodings',
        },
        {
            name: 'delimiter',
            type: 'select',
            label: 'Delimiter',
            options: [
                { value: ' ', label: 'Space' },
                { value: '', label: 'None' },
                { value: '-', label: 'Dash' },
                { value: ',', label: 'Comma' },
            ],
        },
        {
            name: 'input',
            type: 'textarea',
            label: '',
            isInput: true,
            placeholder: (mode) =>
                mode === 'decode'
                    ? 'Enter binary groups e.g. 01001000 01100101'
                    : 'Enter text...',
            className: (mode) => (mode === 'decode' ? 'font-mono' : undefined),
        },
    ],
    onSubmit: async (values) => {
        const { mode, encoding, delimiter, input } = values
        const enc = isValidEncoding(encoding) ? encoding : 'utf8'
        return mode === 'decode'
            ? await Binary.toText(input, { encoding: enc, delimiter })
            : await Binary.fromText(input, { encoding: enc, delimiter })
    },
    inputLabel: (mode) => (mode === 'decode' ? 'Binary input' : 'Text input'),
    outputLabel: (mode) => (mode === 'decode' ? 'Text output' : 'Binary output'),
}

// ---------------------------------------------------------------------------
// Base64 converter config
// ---------------------------------------------------------------------------

export const base64ConverterConfig: ConverterConfig<Base64ConverterForm> = {
    title: 'Text \u2194 Base64 Converter',
    description: 'Convert between text and Base64. Choose mode and encoding.',
    schema: base64ConverterSchema,
    defaultValues: {
        mode: 'encode',
        encoding: 'utf8',
        input: '',
    },
    fields: [
        {
            name: 'mode',
            type: 'select',
            label: 'Mode',
            options: modeOptions('Base64', 'Base64'),
        },
        {
            name: 'encoding',
            type: 'select',
            label: 'Character encoding',
            options: 'encodings',
        },
        {
            name: 'input',
            type: 'textarea',
            label: '',
            isInput: true,
            placeholder: (mode) =>
                mode === 'decode'
                    ? 'Enter Base64 string e.g. SGVsbG8gV29ybGQ='
                    : 'Enter text...',
            className: (mode) => (mode === 'decode' ? 'font-mono' : undefined),
        },
    ],
    onSubmit: async (values) => {
        const { mode, encoding, input } = values
        const enc = isValidEncoding(encoding) ? encoding : 'utf8'
        return mode === 'decode'
            ? await Base64.decode(input, { encoding: enc })
            : await Base64.encode(input, { encoding: enc })
    },
    inputLabel: (mode) => (mode === 'decode' ? 'Base64 input' : 'Text input'),
    outputLabel: (mode) => (mode === 'decode' ? 'Text output' : 'Base64 output'),
}

// ---------------------------------------------------------------------------
// Hex converter config
// ---------------------------------------------------------------------------

export const hexConverterConfig: ConverterConfig<HexConverterForm> = {
    title: 'Text \u2194 Hex Converter',
    description: 'Convert between text and hexadecimal. Choose mode, encoding, and format.',
    schema: hexConverterSchema,
    defaultValues: {
        mode: 'encode',
        encoding: 'utf8',
        uppercase: 'false',
        delimiter: '',
        input: '',
    },
    fields: [
        {
            name: 'mode',
            type: 'select',
            label: 'Mode',
            options: modeOptions('Hex', 'Hex'),
        },
        {
            name: 'encoding',
            type: 'select',
            label: 'Character encoding',
            options: 'encodings',
        },
        {
            name: 'uppercase',
            type: 'select',
            label: 'Output case',
            options: [
                { value: 'false', label: 'Lowercase' },
                { value: 'true', label: 'Uppercase' },
            ],
            visibleWhen: (values) => values.mode === 'encode',
        },
        {
            name: 'delimiter',
            type: 'select',
            label: 'Delimiter',
            options: [
                { value: '', label: 'None' },
                { value: ' ', label: 'Space' },
                { value: ':', label: 'Colon' },
                { value: '-', label: 'Dash' },
                { value: ',', label: 'Comma' },
            ],
        },
        {
            name: 'input',
            type: 'textarea',
            label: '',
            isInput: true,
            placeholder: (mode) =>
                mode === 'decode'
                    ? 'Enter hex string e.g. 48656c6c6f'
                    : 'Enter text...',
            className: (mode) => (mode === 'decode' ? 'font-mono' : undefined),
        },
    ],
    onSubmit: async (values) => {
        const { mode, encoding, uppercase, delimiter, input } = values
        const enc = isValidEncoding(encoding) ? encoding : 'utf8'
        const isUppercase = uppercase === 'true'
        return mode === 'decode'
            ? await Hex.decode(input, { encoding: enc, delimiter })
            : await Hex.encode(input, { encoding: enc, delimiter, uppercase: isUppercase })
    },
    inputLabel: (mode) => (mode === 'decode' ? 'Hex input' : 'Text input'),
    outputLabel: (mode) => (mode === 'decode' ? 'Text output' : 'Hex output'),
}

// ---------------------------------------------------------------------------
// URL Encoder config
// ---------------------------------------------------------------------------

export const urlEncoderConfig: ConverterConfig<URLEncoderForm> = {
    title: 'URL Encoder/Decoder',
    description:
        'Encode or decode URL strings. Choose between component encoding (for query parameters) or full URL encoding.',
    schema: urlEncoderSchema,
    defaultValues: {
        mode: 'encode',
        encoding: 'utf8',
        encodingMode: 'component',
        input: '',
    },
    fields: [
        {
            name: 'mode',
            type: 'select',
            label: 'Mode',
            options: modeOptions('URL', 'URL'),
        },
        {
            name: 'encoding',
            type: 'select',
            label: 'Character encoding',
            options: 'encodings',
        },
        {
            name: 'encodingMode',
            type: 'select',
            label: 'Encoding Mode',
            options: [
                { value: 'component', label: 'Component (for query params, encodes more characters)' },
                { value: 'full', label: "Full URL (preserves :/?#[]@!$&'()*+,;=)" },
            ],
        },
        {
            name: 'input',
            type: 'textarea',
            label: '',
            isInput: true,
            rows: 6,
            placeholder: (mode) =>
                mode === 'decode'
                    ? 'Enter URL-encoded text (e.g., Hello%20World)'
                    : 'Enter text to encode (e.g., Hello World)',
        },
    ],
    onSubmit: async (values) => {
        const { mode, encoding, encodingMode, input } = values
        const enc = isValidEncoding(encoding) ? encoding : 'utf8'
        return mode === 'decode'
            ? await URLEncode.decode(input, { mode: encodingMode, encoding: enc })
            : await URLEncode.encode(input, { mode: encodingMode, encoding: enc })
    },
    inputLabel: (mode) => (mode === 'decode' ? 'URL-encoded input' : 'Text input'),
    outputLabel: (mode) => (mode === 'decode' ? 'Decoded output' : 'URL-encoded output'),
}
