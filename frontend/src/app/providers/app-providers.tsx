import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { TripProvider } from '@/features/trip/context/trip-context'
import { queryClient } from '@/lib/query-client'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <TripProvider>{children}</TripProvider>
  </QueryClientProvider>
)
