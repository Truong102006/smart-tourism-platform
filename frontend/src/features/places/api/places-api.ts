import { places } from '@/data/places'
import type { Place, PlaceFilters } from '@/features/places/types/place'

const delay = async (milliseconds: number, signal?: AbortSignal): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, milliseconds)

    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeoutId)
        reject(new DOMException('Request aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

export const placesApi = {
  async list(filters: PlaceFilters = {}, signal?: AbortSignal): Promise<Place[]> {
    await delay(420, signal)
    const normalizedQuery = filters.query?.trim().toLocaleLowerCase('vi') ?? ''

    return places.filter((place) => {
      const matchesQuery =
        !normalizedQuery ||
        [place.name, place.city, place.shortDescription, ...place.tags]
          .join(' ')
          .toLocaleLowerCase('vi')
          .includes(normalizedQuery)
      const matchesRegion = !filters.region || filters.region === 'Tất cả' || place.region === filters.region
      const matchesCategory =
        !filters.category || filters.category === 'Tất cả' || place.category === filters.category

      return matchesQuery && matchesRegion && matchesCategory
    })
  },

  async getBySlug(slug: string, signal?: AbortSignal): Promise<Place | undefined> {
    await delay(280, signal)
    return places.find((place) => place.slug === slug)
  },
}
