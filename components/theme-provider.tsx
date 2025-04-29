"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.PropsWithChildren<any>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

function useTheme() {
  return {
    setTheme: (theme: string) => {
      if (typeof window !== "undefined") {
        window.document.documentElement.setAttribute("data-theme", theme)
      }
    },
    theme: typeof window !== "undefined" ? window.document.documentElement.getAttribute("data-theme") : "light",
  }
}

export { useTheme }
