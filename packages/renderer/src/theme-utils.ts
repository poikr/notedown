export type ThemeSetting = "light" | "dark" | "auto";

export interface ResolvedThemedValue {
  mode: "static" | "auto";
  value: string | null;
  lightValue: string | null;
  darkValue: string | null;
}

export function resolveThemedColor(
  light: string | null,
  dark: string | null,
  theme: ThemeSetting,
): ResolvedThemedValue {
  if (light && dark) {
    if (theme === "auto") {
      return { mode: "auto", value: null, lightValue: light, darkValue: dark };
    }
    return { mode: "static", value: theme === "dark" ? dark : light, lightValue: null, darkValue: null };
  }
  return { mode: "static", value: light || dark, lightValue: null, darkValue: null };
}
