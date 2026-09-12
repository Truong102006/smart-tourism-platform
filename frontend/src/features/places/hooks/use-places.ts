import { useQuery } from '@tanstack/react-query'
import { placesApi } from '@/features/places/api/places-api'
import type { PlaceFilters } from '@/features/places/types/place'

export const usePlaces = (filters: PlaceFilters = {}) =>
  useQuery({
    queryKey: ['places', filters],
    queryFn: ({ signal }) => placesApi.list(filters, signal),
  })

export const usePlace = (slug: string) =>
  useQuery({
    queryKey: ['place', slug],
    queryFn: ({ signal }) => placesApi.getBySlug(slug, signal),
    enabled: Boolean(slug),
  })
