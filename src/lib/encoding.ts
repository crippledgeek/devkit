import {
    EncodingError,
    ERROR_CODES,
    validateBinaryFormat,
    validateBase64Format,
    validateHexFormat,
    validateInputSize,
    validateNotEmpty,
} from './errors'

/**
 * Commonly used encodings supported by iconv-lite.
 * (full list: https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
 */
export const ALL_ENCODINGS = [
    // Unicode
    'utf8', 'utf-8', 'utf16le', 'ucs2',

    // ASCII and aliases
    'ascii', 'latin1',

    // ISO-8859 family (no 12)
    'iso-8859-1', 'iso-8859-2', 'iso-8859-3', 'iso-8859-4', 'iso-8859-5',
    'iso-8859-6', 'iso-8859-7', 'iso-8859-8', 'iso-8859-9', 'iso-8859-10',
    'iso-8859-11', /*'iso-8859-12',*/ 'iso-8859-13', 'iso-8859-14',
    'iso-8859-15', 'iso-8859-16',

    // Windows-125x
    'windows-1250', 'windows-1251', 'windows-1252', 'windows-1253', 'windows-1254',
    'windows-1255', 'windows-1256', 'windows-1257', 'windows-1258',

    // Mac
    'macroman', 'macintosh',

    // KOI8
    'koi8-r', 'koi8-u',

    // DOS / Code pages
    'cp437', 'cp737', 'cp775', 'cp850', 'cp852', 'cp855', 'cp856', 'cp857', 'cp858',
    'cp860', 'cp861', 'cp862', 'cp863', 'cp864', 'cp865', 'cp866', 'cp869',
    'cp874', 'cp1006',

    // East Asian and aliases
    'gbk', 'gb2312', 'gb18030',
    'big5',
    'euc-jp', 'shift_jis', 'shift-jis',
    'euc-kr',
    'cp932', 'cp936', 'cp949', 'cp950',
] as const

export type ValidEncoding = typeof ALL_ENCODINGS[number]

export function isValidEncoding(value: string): value is ValidEncoding {
    return (ALL_ENCODINGS as readonly string[]).includes(value)
}

/**
 * Options for ToBinary / ToString.
 */
export interface BinaryEncodingOptions {
    /** Character encoding to use (default: 'utf8') */
    encoding?: ValidEncoding;
    /** Delimiter between byte groups in the binary string (default: ' ') */
    delimiter?: string;
}

/**
 * Options for Base64 conversion.
 */
export interface Base64EncodingOptions {
    /** Character encoding to use (default: 'utf8') */
    encoding?: ValidEncoding;
}

/**
 * Options for Hex conversion.
 */
export interface HexEncodingOptions {
    /** Character encoding to use (default: 'utf8') */
    encoding?: ValidEncoding;
    /** Delimiter between hex bytes (default: '') */
    delimiter?: string;
    /** Use uppercase hex (default: false) */
    uppercase?: boolean;
}

// Lazy iconv-lite loader (separate chunk)
type IconvLite = typeof import('iconv-lite')
let iconvPromise: Promise<IconvLite> | null = null;
async function getIconv(): Promise<IconvLite> {
    if (!iconvPromise) {
        iconvPromise = import('iconv-lite')
    }
    return iconvPromise
}

/**
 * Preload the iconv-lite module chunk. Useful to warm it up in a route loader.
 */
export async function ensureIconvLoaded(): Promise<IconvLite> {
    return await getIconv()
}

/**
 * Normalize common encoding labels into iconv-lite equivalents.
 */
function normalizeEncoding(label: ValidEncoding): string {
    const l = label.trim().toLowerCase();
    switch (l) {
        case 'utf-8':
            return 'utf8';
        case 'latin1':
        case 'iso-8859-1':
            return 'latin1';
        case 'shift-jis':
            return 'shift_jis';
        default:
            return l;
    }
}

function isUtf8(enc?: string) {
    const e = (enc ?? 'utf8').toLowerCase();
    return e === 'utf8' || e === 'utf-8';
}

/**
 * Encode text to bytes using the specified charset.
 */
async function encodeToBytes(text: string, encoding: ValidEncoding): Promise<Uint8Array> {
    if (isUtf8(encoding)) {
        const enc = new TextEncoder();
        return enc.encode(text);
    }

    const enc = normalizeEncoding(encoding);
    const iconv = await getIconv();

    if (!iconv.encodingExists(enc)) {
        throw new EncodingError(
            `Encoding "${encoding}" is not supported (normalized to "${enc}").`,
            ERROR_CODES.INVALID_ENCODING
        );
    }

    return iconv.encode(text, enc);
}

/**
 * Decode bytes to text using the specified charset.
 */
async function decodeFromBytes(bytes: Uint8Array, encoding: ValidEncoding): Promise<string> {
    if (isUtf8(encoding)) {
        const dec = new TextDecoder('utf-8');
        return dec.decode(bytes);
    }

    const enc = normalizeEncoding(encoding);
    const iconv = await getIconv();

    if (!iconv.encodingExists(enc)) {
        throw new EncodingError(
            `Encoding "${encoding}" is not supported (normalized to "${enc}").`,
            ERROR_CODES.INVALID_ENCODING
        );
    }

    return iconv.decode(bytes, enc);
}

/**
 * Converts a string to its binary representation (8-bit groups) using the chosen encoding.
 * @example
 * await ToBinary("Hello") // "01001000 01100101 01101100 01101100 01101111"
 * await ToBinary("Hello", { delimiter: '-' }) // "01001000-01100101-01101100-01101100-01101111"
 */
async function ToBinary(
    text: string,
    options: BinaryEncodingOptions = {}
): Promise<string> {
    const { encoding = 'utf8', delimiter = ' ' } = options;
    if (!text) return '';

    validateNotEmpty(text, 'Text input');
    validateInputSize(text);

    const buf = await encodeToBytes(text, encoding);
    return Array.from(buf, (b) => b.toString(2).padStart(8, '0')).join(delimiter);
}

/**
 * Converts a binary string (8-bit groups) back to a string using the chosen encoding.
 * @example
 * await ToText("01001000 01100101 01101100 01101100 01101111") // "Hello"
 */
async function ToText(
    binary: string,
    options: BinaryEncodingOptions = {}
): Promise<string> {
    const { encoding = 'utf8', delimiter = ' ' } = options;
    if (!binary) return '';

    validateBinaryFormat(binary, delimiter);
    validateInputSize(binary);

    let groups: string[];
    if (delimiter === '') {
        const compact = binary.replace(/[^01]/g, '');
        groups = [];
        for (let i = 0; i < compact.length; i += 8) {
            groups.push(compact.slice(i, i + 8));
        }
    } else {
        const normalized = binary.trim();
        groups = normalized.split(delimiter);
    }

    const bytes = groups
        .filter((g) => g.length === 8 && /^[01]+$/.test(g))
        .map((b) => parseInt(b, 2))
        .filter((n) => Number.isInteger(n) && n >= 0 && n <= 255);

    const buf = new Uint8Array(bytes);
    return await decodeFromBytes(buf, encoding);
}

/**
 * Encode string to Base64 with a specific encoding.
 * @example
 * await ToBase64("Hello") // "SGVsbG8="
 * await ToBase64("Привет", { encoding: 'windows-1251' }) // Base64 of win1251 bytes
 */
async function ToBase64(
    text: string,
    options: Base64EncodingOptions = {}
): Promise<string> {
    const { encoding = 'utf8' } = options;
    if (!text) return '';

    validateNotEmpty(text, 'Text input');
    validateInputSize(text);

    const buf = await encodeToBytes(text, encoding);
    const binaryString = Array.from(buf, b => String.fromCharCode(b)).join('');
    return btoa(binaryString);
}

/**
 * Decode Base64 back to string with a specific encoding.
 * @example
 * await FromBase64("SGVsbG8=") // "Hello"
 * await FromBase64(base64String, { encoding: 'windows-1251' }) // Decodes from win1251
 */
async function FromBase64(
    base64: string,
    options: Base64EncodingOptions = {}
): Promise<string> {
    const { encoding = 'utf8' } = options;
    if (!base64) return '';

    validateBase64Format(base64);
    validateInputSize(base64);

    try {
        const binaryString = atob(base64.trim());
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return await decodeFromBytes(bytes, encoding);
    } catch {
        throw new EncodingError(
            'Failed to decode Base64 string. Please check the input format.',
            ERROR_CODES.DECODE_FAILED
        );
    }
}

/**
 * Encode string to Hex with a specific encoding.
 * @example
 * await ToHex("Hello") // "48656c6c6f"
 * await ToHex("Hello", { delimiter: ' ' }) // "48 65 6c 6c 6f"
 * await ToHex("Hello", { uppercase: true }) // "48656C6C6F"
 * await ToHex("Привет", { encoding: 'windows-1251' }) // "cff0e8e2e5f2"
 */
async function ToHex(
    text: string,
    options: HexEncodingOptions = {}
): Promise<string> {
    const { encoding = 'utf8', delimiter = '', uppercase = false } = options;
    if (!text) return '';

    validateNotEmpty(text, 'Text input');
    validateInputSize(text);

    const buf = await encodeToBytes(text, encoding);
    const hex = Array.from(buf, b => b.toString(16).padStart(2, '0'));
    const result = hex.join(delimiter);
    return uppercase ? result.toUpperCase() : result;
}

/**
 * Decode Hex back to string with a specific encoding.
 * @example
 * await FromHex("48656c6c6f") // "Hello"
 * await FromHex("48 65 6c 6c 6f", { delimiter: ' ' }) // "Hello"
 * await FromHex("cff0e8e2e5f2", { encoding: 'windows-1251' }) // "Привет"
 * await FromHex("0x48656c6c6f") // "Hello" (handles 0x prefix)
 */
async function FromHex(
    hex: string,
    options: HexEncodingOptions = {}
): Promise<string> {
    const { encoding = 'utf8', delimiter = '' } = options;
    if (!hex) return '';

    validateHexFormat(hex, delimiter);
    validateInputSize(hex);

    const cleaned = hex.trim().replace(/^(0x|\\x)/gi, '');

    let hexPairs: string[];
    if (delimiter) {
        hexPairs = cleaned.split(delimiter);
    } else {
        hexPairs = cleaned.match(/.{1,2}/g) || [];
    }

    const bytes = hexPairs
        .filter(h => /^[0-9a-fA-F]{1,2}$/.test(h))
        .map(h => parseInt(h, 16))
        .filter(n => Number.isInteger(n) && n >= 0 && n <= 255);

    const buf = new Uint8Array(bytes);
    return await decodeFromBytes(buf, encoding);
}

/**
 * Get a list of popular encodings for UI dropdowns
 */
export const POPULAR_ENCODINGS: readonly ValidEncoding[] = ALL_ENCODINGS;

/**
 * Check if an encoding is supported
 */
export async function isEncodingSupported(encoding: string): Promise<boolean> {
    try {
        const enc = normalizeEncoding(encoding as ValidEncoding);
        if (isUtf8(enc)) return true;
        const iconv = await getIconv();
        return iconv.encodingExists(enc);
    } catch {
        return false;
    }
}

/**
 * Namespaced helpers for binary conversions for ergonomic API.
 */
export const Binary = {
    toText: ToText,
    fromText: ToBinary,
};

/**
 * Namespaced helpers for Base64 conversions for ergonomic API.
 */
export const Base64 = {
    encode: ToBase64,
    decode: FromBase64,
};

/**
 * Namespaced helpers for Hex conversions for ergonomic API.
 */
export const Hex = {
    encode: ToHex,
    decode: FromHex,
};

/**
 * URL encoding options
 */
export interface URLEncodingOptions {
    mode?: 'component' | 'full'
    encoding?: ValidEncoding
}

/**
 * Encode string to URL-encoded format.
 * @example
 * URLEncode.encode("Hello World") // "Hello%20World"
 * URLEncode.encode("Hello World", { mode: 'component' }) // "Hello%20World"
 * URLEncode.encode("https://example.com/path?q=hello world", { mode: 'full' }) // "https://example.com/path?q=hello%20world"
 * URLEncode.encode("Привет", { encoding: 'windows-1251' }) // "%CF%F0%E8%E2%E5%F2"
 */
async function EncodeURL(
    text: string,
    options: URLEncodingOptions = {}
): Promise<string> {
    const { mode = 'component', encoding = 'utf8' } = options;
    if (!text) return '';

    validateNotEmpty(text, 'Text input');
    validateInputSize(text);

    try {
        // If UTF-8, use native browser encoding
        if (isUtf8(encoding)) {
            if (mode === 'full') {
                return encodeURI(text);
            }
            return encodeURIComponent(text);
        }

        // For other encodings, convert to bytes first, then percent-encode
        const bytes = await encodeToBytes(text, encoding);
        const encoded = Array.from(bytes, byte =>
            // Only encode non-ASCII and special characters
            (byte >= 0x30 && byte <= 0x39) || // 0-9
            (byte >= 0x41 && byte <= 0x5A) || // A-Z
            (byte >= 0x61 && byte <= 0x7A) || // a-z
            (mode === 'component' && (byte === 0x2D || byte === 0x5F || byte === 0x2E || byte === 0x7E)) || // -_.~
            (mode === 'full' && (
                byte === 0x3A || byte === 0x2F || byte === 0x3F || byte === 0x23 || // :/?#
                byte === 0x5B || byte === 0x5D || byte === 0x40 || byte === 0x21 || // []@!
                byte === 0x24 || byte === 0x26 || byte === 0x27 || byte === 0x28 || // $&'(
                byte === 0x29 || byte === 0x2A || byte === 0x2B || byte === 0x2C || // )*+,
                byte === 0x3B || byte === 0x3D || byte === 0x2D || byte === 0x5F || // ;=-_
                byte === 0x2E || byte === 0x7E // .~
            ))
                ? String.fromCharCode(byte)
                : `%${byte.toString(16).toUpperCase().padStart(2, '0')}`
        ).join('');

        return encoded;
    } catch {
        throw new EncodingError(
            'Failed to encode URL. Please check the input.',
            ERROR_CODES.ENCODE_FAILED
        );
    }
}

/**
 * Decode URL-encoded string.
 * @example
 * URLEncode.decode("Hello%20World") // "Hello World"
 * URLEncode.decode("https://example.com/path?q=hello%20world", { mode: 'full' }) // "https://example.com/path?q=hello world"
 * URLEncode.decode("%CF%F0%E8%E2%E5%F2", { encoding: 'windows-1251' }) // "Привет"
 */
async function DecodeURL(
    urlEncoded: string,
    options: URLEncodingOptions = {}
): Promise<string> {
    const { mode = 'component', encoding = 'utf8' } = options;
    if (!urlEncoded) return '';

    validateNotEmpty(urlEncoded, 'URL input');
    validateInputSize(urlEncoded);

    try {
        // If UTF-8, use native browser decoding
        if (isUtf8(encoding)) {
            if (mode === 'full') {
                return decodeURI(urlEncoded);
            }
            return decodeURIComponent(urlEncoded);
        }

        // For other encodings, decode percent-encoding to bytes first
        const bytes: number[] = [];
        let i = 0;
        while (i < urlEncoded.length) {
            if (urlEncoded[i] === '%' && i + 2 < urlEncoded.length) {
                const hex = urlEncoded.substring(i + 1, i + 3);
                const byte = parseInt(hex, 16);
                if (!isNaN(byte)) {
                    bytes.push(byte);
                    i += 3;
                } else {
                    bytes.push(urlEncoded.charCodeAt(i));
                    i++;
                }
            } else {
                bytes.push(urlEncoded.charCodeAt(i));
                i++;
            }
        }

        // Convert bytes to text using the specified encoding
        const buf = new Uint8Array(bytes);
        return await decodeFromBytes(buf, encoding);
    } catch {
        throw new EncodingError(
            'Failed to decode URL. The input may be malformed or contain invalid percent-encoding.',
            ERROR_CODES.DECODE_FAILED
        );
    }
}

/**
 * Parse query string into key-value pairs
 * @example
 * URLEncode.parseQuery("?key1=value1&key2=value2") // { key1: "value1", key2: "value2" }
 */
function ParseQueryString(queryString: string): Record<string, string> {
    if (!queryString) return {};

    // Remove leading ? or # if present
    const cleaned = queryString.replace(/^[?#]/, '');
    if (!cleaned) return {};

    const params: Record<string, string> = {};
    const pairs = cleaned.split('&');

    for (const pair of pairs) {
        const [key, value = ''] = pair.split('=');
        if (key) {
            try {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            } catch {
                // If decoding fails, use the raw value
                params[key] = value;
            }
        }
    }

    return params;
}

/**
 * Build query string from key-value pairs
 * @example
 * URLEncode.buildQuery({ key1: "value1", key2: "value2" }) // "key1=value1&key2=value2"
 */
function BuildQueryString(params: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) return '';

    return Object.entries(params)
        .filter(([key]) => key !== '')
        .map(([key, value]) => {
            try {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            } catch {
                return `${key}=${value}`;
            }
        })
        .join('&');
}

/**
 * Namespaced helpers for URL encoding for ergonomic API.
 */
export const URLEncode = {
    encode: EncodeURL,
    decode: DecodeURL,
    parseQuery: ParseQueryString,
    buildQuery: BuildQueryString,
};

