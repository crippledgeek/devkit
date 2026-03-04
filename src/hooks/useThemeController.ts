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

    const setTheme = (mode: ThemeMode) => {
        const dark = mode === "dark" || (mode === "system" && systemDark);
        if (dark) enable(); else disable();
    };

    return {setTheme, isDark}
}