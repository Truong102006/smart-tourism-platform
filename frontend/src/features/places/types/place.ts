export type PlaceCategory =
  | 'Di sản'
  | 'Thiên nhiên'
  | 'Ẩm thực'
  | 'Nghệ thuật'
  | 'Nghỉ dưỡng'

export type PlaceRegion = 'Bắc' | 'Trung' | 'Nam'

export interface PlaceCoordinates {
  lat: number
  lng: number
}

export interface Place {
  id: string
  slug: string
  name: string
  city: string
  region: PlaceRegion
  category: PlaceCategory
  shortDescription: string
  description: string
  rating: number
  reviewCount: number
  priceLabel: string
  duration: string
  image: string
  coordinates: PlaceCoordinates
  highlights: string[]
  tags: string[]
  address: string
  bestTime: string
}

export interface PlaceFilters {
  query?: string
  region?: PlaceRegion | 'Tất cả'
  category?: PlaceCategory | 'Tất cả'
}
