import { Theme } from "@/types";
import { createContext, useContext } from "react";

interface Context {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<null | Context>(null);

export function useTheme() {
  const themeContext = useContext(ThemeContext);
  if (themeContext == null) throw new Error("Null context");
  return themeContext;
}
