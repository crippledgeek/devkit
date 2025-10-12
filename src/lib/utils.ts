import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Advanced Readonly Utility Types
// Exclude keys that look like setters (e.g., setFoo)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NeverOnSet<T> = T extends `set${infer _Rem}` ? never : T;

/**
 * Deep, customizable readonly utility type.
 * - Skips function properties.
 * - Optionally skips keys that look like setters.
 * - Recursively applies readonly to nested objects if Deep is true.
 */
export type BetterReadonly<T, Deep extends boolean = true> = {
    readonly [Key in keyof T as NeverOnSet<Key & string>]:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    T[Key] extends Function
        ? T[Key]
        : Deep extends true
            ? T[Key] extends object
                ? BetterReadonly<T[Key], Deep>
                : T[Key]
            : T[Key]
};


