/**
 * Commonly used encodings supported by iconv-lite.
 * (full list: https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
 */
// Define the full set of supported encodings once and derive the ValidEncoding type from it
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

    // Fast path: use native TextEncoder for UTF-8
    if (isUtf8(encoding)) {
        const enc = new TextEncoder();
        const buf = enc.encode(text);
        return Array.from(buf, (b) => b.toString(2).padStart(8, '0')).join(delimiter);
    }

    const enc = normalizeEncoding(encoding);
    const iconv = await getIconv();

    if (!iconv.encodingExists(enc)) {
        throw new Error(`Unsupported encoding: "${encoding}" (normalized: "${enc}")`);
    }

    const buf = iconv.encode(text, enc);
    return Array.from(buf, (b: number) => b.toString(2).padStart(8, '0')).join(delimiter);
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

    // Normalize and split into 8-bit groups
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

    // Fast path: use native TextDecoder for UTF-8
    if (isUtf8(encoding)) {
        const dec = new TextDecoder('utf-8');
        return dec.decode(buf);
    }

    const enc = normalizeEncoding(encoding);
    const iconv = await getIconv();

    if (!iconv.encodingExists(enc)) {
        throw new Error(`Unsupported encoding: "${encoding}" (normalized: "${enc}")`);
    }

    return iconv.decode(buf, enc);
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

    // Fast path: use native btoa for UTF-8
    if (isUtf8(encoding)) {
        const enc = new TextEncoder();
        const buf = enc.encode(text);
        // Convert Uint8Array to binary string for btoa
        const binaryString = Array.from(buf, b => String.fromCharCode(b)).join('');
        return btoa(binaryString);
    }

    const enc = normalizeEncoding(encoding);
    const iconv = await getIconv();

    if (!iconv.encodingExists(enc)) {
        throw new Error(`Unsupported encoding: "${encoding}" (normalized: "${enc}")`);
    }

    const buf = iconv.encode(text, enc);
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

    // Decode base64 to binary string
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Fast path: use native TextDecoder for UTF-8
    if (isUtf8(encoding)) {
        const dec = new TextDecoder('utf-8');
        return dec.decode(bytes);
    }

    const enc = normalizeEncoding(encoding);
    const iconv = await getIconv();

    if (!iconv.encodingExists(enc)) {
        throw new Error(`Unsupported encoding: "${encoding}" (normalized: "${enc}")`);
    }

    return iconv.decode(bytes, enc);
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