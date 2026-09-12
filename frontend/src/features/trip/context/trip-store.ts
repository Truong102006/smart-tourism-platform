import { createContext, useContext } from 'react'

export interface ItineraryItem {
  placeId: string
  day: number
}

export interface TripContextValue {
  favoriteIds: string[]
  itinerary: ItineraryItem[]
  toggleFavorite: (placeId: string) => void
  addToItinerary: (placeId: string, day?: number) => void
  removeFromItinerary: (placeId: string) => void
  moveToDay: (placeId: string, day: number) => void
}

export const TripContext = createContext<TripContextValue | null>(null)

export const useTrip = (): TripContextValue => {
  const context = useContext(TripContext)

  if (!context) {
    throw new Error('useTrip must be used inside TripProvider')
  }

  return context
}
