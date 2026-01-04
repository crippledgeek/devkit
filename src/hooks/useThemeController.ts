import {
    useDarkMode,
    useIsomorphicLayoutEffect,
    useMediaQuery,
} from "usehooks-ts";

export type ThemeMode = "light" | "dark" | "system";

export function useThemeController() {
    const {isDarkMode: isDark, enable, disable} = useDarkMode({
        localStorageKey: 'devkit-dark-mode',
        initializeWithValue: true,
    });
    const systemDark = useMediaQuery("(prefers-color-scheme: dark)");

    const apply = (dark: boolean) => {
        const root = document.documentElement;
        root.dataset.theme = dark ? "dark" : "light";
        root.classList.toggle("dark", dark);
    };

    // Reflect resolved value in DOM (before paint)
    useIsomorphicLayoutEffect(() => {
        apply(isDark);
    }, [isDark]);

    /**
     * Public API
     * - "dark"   → force dark
     * - "light"  → force light
     * - "system" → follow OS
     */
    const setTheme = (mode: ThemeMode) => {
        if (mode === "dark") {
            enable();
        } else if (mode === "light") {
            disable();
        } else {
            if (systemDark) {
                enable();
            } else {
                disable();
            }
        }
    };

    return {setTheme, isDark}
}