"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
          },
        },
      })
  )

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </AccessibilityProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}