'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
// import { type ThemeProviderProps } from 'next-themes/dist/types' 

export function Providers({ children, ...props }: any) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
