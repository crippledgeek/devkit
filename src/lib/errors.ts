/**
 * Custom error types for encoding operations
 */

/**
 * Standard Schema V1 Issue type for form validation errors
 */
export interface StandardSchemaIssue {
    message: string
    path?: (string | number)[]
    [key: string]: unknown
}

/**
 * Extract error messages from form field errors
 */
export function formatFieldErrors(errors: unknown[]): string {
    return errors.map((err) => (err as StandardSchemaIssue).message).join(', ')
}

export class EncodingError extends Error {
    public readonly code: string

    constructor(message: string, code: string) {
        super(message)
        this.name = 'EncodingError'
        this.code = code
    }
}

export class ValidationError extends Error {
    public readonly field?: string

    constructor(message: string, field?: string) {
        super(message)
        this.name = 'ValidationError'
        this.field = field
    }
}

/**
 * Error codes for specific encoding issues
 */
export const ERROR_CODES = {
    INVALID_ENCODING: 'INVALID_ENCODING',
    INVALID_BINARY: 'INVALID_BINARY',
    INVALID_BASE64: 'INVALID_BASE64',
    INVALID_HEX: 'INVALID_HEX',
    EMPTY_INPUT: 'EMPTY_INPUT',
    INPUT_TOO_LARGE: 'INPUT_TOO_LARGE',
    ENCODE_FAILED: 'ENCODE_FAILED',
    DECODE_FAILED: 'DECODE_FAILED',
} as const

/**
 * Get user-friendly error message from error object
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof ValidationError) {
        return error.message
    }

    if (error instanceof EncodingError) {
        switch (error.code) {
            case ERROR_CODES.INVALID_ENCODING:
                return `Unsupported encoding format. ${error.message}`
            case ERROR_CODES.INVALID_BINARY:
                return `Invalid binary format. Expected 8-bit groups (e.g., "01001000 01100101"). ${error.message}`
            case ERROR_CODES.INVALID_BASE64:
                return `Invalid Base64 format. ${error.message}`
            case ERROR_CODES.INVALID_HEX:
                return `Invalid hexadecimal format. Expected hex digits (0-9, a-f). ${error.message}`
            case ERROR_CODES.DECODE_FAILED:
                return `Failed to decode data. ${error.message}`
            default:
                return error.message
        }
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'An unexpected error occurred. Please try again.'
}

/**
 * Validate input is not empty
 */
export function validateNotEmpty(input: string, fieldName = 'Input'): void {
    if (!input || input.trim() === '') {
        throw new ValidationError(`${fieldName} cannot be empty`, fieldName)
    }
}

/**
 * Validate input size
 */
export function validateInputSize(input: string, maxSize = 10 * 1024 * 1024): void {
    if (input.length > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(0)
        throw new ValidationError(
            `Input is too large. Maximum size is ${sizeMB}MB`,
            'input'
        )
    }
}

/**
 * Validate binary string format
 */
export function validateBinaryFormat(binary: string, delimiter: string): void {
    if (!binary || binary.trim() === '') {
        throw new ValidationError('Binary input cannot be empty', 'input')
    }

    const groups = delimiter === ''
        ? binary.replace(/[^01]/g, '').match(/.{1,8}/g) || []
        : binary.trim().split(delimiter)

    if (groups.length === 0) {
        throw new EncodingError(
            'No valid binary groups found',
            ERROR_CODES.INVALID_BINARY
        )
    }

    const invalidGroups = groups.filter(g => !/^[01]{1,8}$/.test(g))
    if (invalidGroups.length > 0) {
        throw new EncodingError(
            `Found ${invalidGroups.length} invalid binary group(s). Each group must be 8 bits (0 or 1).`,
            ERROR_CODES.INVALID_BINARY
        )
    }
}

/**
 * Validate Base64 string format
 */
export function validateBase64Format(base64: string): void {
    if (!base64 || base64.trim() === '') {
        throw new ValidationError('Base64 input cannot be empty', 'input')
    }

    const cleaned = base64.trim()

    // Base64 regex: alphanumeric + / + = (padding)
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
        throw new EncodingError(
            'Contains invalid characters. Base64 only supports A-Z, a-z, 0-9, +, /, and = for padding.',
            ERROR_CODES.INVALID_BASE64
        )
    }

    // Check length is multiple of 4
    if (cleaned.length % 4 !== 0) {
        throw new EncodingError(
            'Invalid length. Base64 strings must have a length that is a multiple of 4.',
            ERROR_CODES.INVALID_BASE64
        )
    }

    // Check padding is only at the end
    const paddingMatch = cleaned.match(/=+/)
    if (paddingMatch && paddingMatch.index !== cleaned.length - paddingMatch[0].length) {
        throw new EncodingError(
            'Invalid padding. The = character can only appear at the end.',
            ERROR_CODES.INVALID_BASE64
        )
    }
}

/**
 * Validate hexadecimal string format
 */
export function validateHexFormat(hex: string, delimiter: string): void {
    if (!hex || hex.trim() === '') {
        throw new ValidationError('Hex input cannot be empty', 'input')
    }

    const cleaned = hex.trim().replace(/^(0x|\\x)/gi, '')

    const hexPairs = delimiter
        ? cleaned.split(delimiter)
        : cleaned.match(/.{1,2}/g) || []

    if (hexPairs.length === 0) {
        throw new EncodingError(
            'No valid hex data found',
            ERROR_CODES.INVALID_HEX
        )
    }

    const invalidPairs = hexPairs.filter(h => !/^[0-9a-fA-F]{1,2}$/.test(h))
    if (invalidPairs.length > 0) {
        throw new EncodingError(
            `Found ${invalidPairs.length} invalid hex byte(s). Only characters 0-9 and a-f are allowed.`,
            ERROR_CODES.INVALID_HEX
        )
    }
}
