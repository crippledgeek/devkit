import { z } from 'zod'

/**
 * Maximum input size (10MB)
 */
const MAX_INPUT_SIZE = 10 * 1024 * 1024

/**
 * Valid encoding values
 */
const encodingSchema = z.string().min(1, 'Encoding is required')

/**
 * Base input validation
 */
export const baseInputValidation = z
    .string()
    .min(1, 'Input cannot be empty')
    .max(MAX_INPUT_SIZE, `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(0)}MB`)

/**
 * Binary string validation
 */
export const binaryStringSchema = z
    .string()
    .min(1, 'Binary input cannot be empty')
    .max(MAX_INPUT_SIZE, `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(0)}MB`)
    .refine(
        (val) => {
            // Check if it contains only valid binary characters and delimiters
            return /^[01\s,-]+$/.test(val)
        },
        {
            message: 'Binary input must contain only 0s, 1s, and delimiters (space, comma, dash)',
        }
    )
    .refine(
        (val) => {
            // Extract binary groups and validate they are 8-bit
            const groups = val.trim().split(/[\s,-]+/).filter(g => g.length > 0)
            const invalidGroups = groups.filter(g => !/^[01]{8}$/.test(g))
            return invalidGroups.length === 0
        },
        {
            message: 'Each binary group must be exactly 8 bits (e.g., "01001000")',
        }
    )

/**
 * Base64 string validation
 */
export const base64StringSchema = z
    .string()
    .min(1, 'Base64 input cannot be empty')
    .max(MAX_INPUT_SIZE, `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(0)}MB`)
    .refine(
        (val) => {
            const cleaned = val.trim()
            // Base64 regex: alphanumeric + / + = (padding)
            return /^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)
        },
        {
            message: 'Base64 input contains invalid characters. Only A-Z, a-z, 0-9, +, /, and = are allowed',
        }
    )
    .refine(
        (val) => {
            // Check length is multiple of 4
            return val.trim().length % 4 === 0
        },
        {
            message: 'Base64 input must have a length that is a multiple of 4',
        }
    )
    .refine(
        (val) => {
            // Check padding is only at the end
            const cleaned = val.trim()
            const paddingMatch = cleaned.match(/=+/)
            if (!paddingMatch) return true
            return paddingMatch.index === cleaned.length - paddingMatch[0].length
        },
        {
            message: 'Base64 padding (=) can only appear at the end',
        }
    )

/**
 * Hexadecimal string validation
 */
export const hexStringSchema = z
    .string()
    .min(1, 'Hex input cannot be empty')
    .max(MAX_INPUT_SIZE, `Input is too large. Maximum size is ${(MAX_INPUT_SIZE / (1024 * 1024)).toFixed(0)}MB`)
    .refine(
        (val) => {
            // Remove common prefixes and delimiters for validation
            const cleaned = val.trim().replace(/^(0x|\\x)/gi, '').replace(/[\s:,-]/g, '')
            return /^[0-9a-fA-F]+$/.test(cleaned)
        },
        {
            message: 'Hex input contains invalid characters. Only 0-9, a-f, A-F, and delimiters are allowed',
        }
    )
    .refine(
        (val) => {
            // After removing delimiters, should have even number of chars (pairs)
            const cleaned = val.trim().replace(/^(0x|\\x)/gi, '').replace(/[\s:,-]/g, '')
            return cleaned.length % 2 === 0
        },
        {
            message: 'Hex input must have an even number of characters (byte pairs)',
        }
    )

/**
 * Delimiter validation
 */
const delimiterSchema = z.string()

/**
 * Mode validation
 */
const modeSchema = z.enum(['encode', 'decode'])

/**
 * Schema for Binary converter form
 */
export const binaryConverterSchema = z.object({
    mode: modeSchema,
    encoding: encodingSchema,
    delimiter: delimiterSchema,
    input: z.string(),
}).superRefine((data, ctx) => {
    // Conditional validation based on mode
    if (data.mode === 'encode') {
        const result = baseInputValidation.safeParse(data.input)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    ...issue,
                    path: ['input'],
                })
            })
        }
    } else {
        const result = binaryStringSchema.safeParse(data.input)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    ...issue,
                    path: ['input'],
                })
            })
        }
    }
})

/**
 * Schema for Base64 converter form
 */
export const base64ConverterSchema = z.object({
    mode: modeSchema,
    encoding: encodingSchema,
    input: z.string(),
}).superRefine((data, ctx) => {
    // Conditional validation based on mode
    if (data.mode === 'encode') {
        const result = baseInputValidation.safeParse(data.input)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    ...issue,
                    path: ['input'],
                })
            })
        }
    } else {
        const result = base64StringSchema.safeParse(data.input)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    ...issue,
                    path: ['input'],
                })
            })
        }
    }
})

/**
 * Schema for Hexadecimal converter form
 */
export const hexConverterSchema = z.object({
    mode: modeSchema,
    encoding: encodingSchema,
    uppercase: z.string(),
    delimiter: delimiterSchema,
    input: z.string(),
}).superRefine((data, ctx) => {
    // Conditional validation based on mode
    if (data.mode === 'encode') {
        const result = baseInputValidation.safeParse(data.input)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    ...issue,
                    path: ['input'],
                })
            })
        }
    } else {
        const result = hexStringSchema.safeParse(data.input)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                ctx.addIssue({
                    ...issue,
                    path: ['input'],
                })
            })
        }
    }
})

/**
 * Type exports
 */
export type BinaryConverterForm = z.infer<typeof binaryConverterSchema>
export type Base64ConverterForm = z.infer<typeof base64ConverterSchema>
export type HexConverterForm = z.infer<typeof hexConverterSchema>
