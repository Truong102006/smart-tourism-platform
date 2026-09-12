import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { TripContext, type ItineraryItem } from '@/features/trip/context/trip-store'

interface TripProviderProps {
  children: ReactNode
}

const readStoredArray = <T,>(key: string): T[] => {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T[]) : []
  } catch {
    return []
  }
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    readStoredArray<string>('di-day-favorites'),
  )
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() =>
    readStoredArray<ItineraryItem>('di-day-itinerary'),
  )

  useEffect(() => {
    localStorage.setItem('di-day-favorites', JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    localStorage.setItem('di-day-itinerary', JSON.stringify(itinerary))
  }, [itinerary])

  const toggleFavorite = useCallback((placeId: string): void => {
    setFavoriteIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    )
  }, [])

  const addToItinerary = useCallback((placeId: string, day = 1): void => {
    setItinerary((current) => {
      if (current.some((item) => item.placeId === placeId)) return current
      return [...current, { placeId, day }]
    })
  }, [])

  const removeFromItinerary = useCallback((placeId: string): void => {
    setItinerary((current) => current.filter((item) => item.placeId !== placeId))
  }, [])

  const moveToDay = useCallback((placeId: string, day: number): void => {
    setItinerary((current) =>
      current.map((item) => (item.placeId === placeId ? { ...item, day } : item)),
    )
  }, [])

  const value = useMemo(
    () => ({
      favoriteIds,
      itinerary,
      toggleFavorite,
      addToItinerary,
      removeFromItinerary,
      moveToDay,
    }),
    [addToItinerary, favoriteIds, itinerary, moveToDay, removeFromItinerary, toggleFavorite],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}
