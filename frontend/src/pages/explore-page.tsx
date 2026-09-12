import { FunnelSimple, MagnifyingGlass, MapTrifold, X } from '@phosphor-icons/react'
import { lazy, Suspense, useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { InlineState } from '@/components/feedback/inline-state'
import { PlaceCard } from '@/components/places/place-card'
import { usePlaces } from '@/features/places/hooks/use-places'
import type { PlaceCategory, PlaceRegion } from '@/features/places/types/place'

const MapPanel = lazy(() => import('@/features/places/components/map-panel'))
const regions: Array<PlaceRegion | 'Tất cả'> = ['Tất cả', 'Bắc', 'Trung', 'Nam']
const categories: Array<PlaceCategory | 'Tất cả'> = [
  'Tất cả',
  'Di sản',
  'Thiên nhiên',
  'Ẩm thực',
  'Nghệ thuật',
  'Nghỉ dưỡng',
]

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [region, setRegion] = useState<PlaceRegion | 'Tất cả'>('Tất cả')
  const [category, setCategory] = useState<PlaceCategory | 'Tất cả'>('Tất cả')
  const [showMap, setShowMap] = useState(true)
  const deferredQuery = useDeferredValue(query)
  const filters = useMemo(
    () => ({ query: deferredQuery, region, category }),
    [category, deferredQuery, region],
  )
  const placesQuery = usePlaces(filters)

  const updateQuery = (value: string): void => {
    setQuery(value)
    const nextParams = new URLSearchParams(searchParams)
    if (value.trim()) nextParams.set('q', value)
    else nextParams.delete('q')
    setSearchParams(nextParams, { replace: true })
  }

  const resetFilters = (): void => {
    setQuery('')
    setRegion('Tất cả')
    setCategory('Tất cả')
    setSearchParams({}, { replace: true })
  }

  return (
    <main className="explore-page page-shell">
      <header className="page-heading">
        <p className="eyebrow">Đi đâu hôm nay?</p>
        <h1>Chọn một nơi hợp nhịp của bạn.</h1>
        <p>Tìm theo vùng, kiểu trải nghiệm hoặc điều bạn đang muốn làm.</p>
      </header>

      <section className="filters" aria-label="Bộ lọc địa điểm">
        <label className="search-field" htmlFor="explore-search">
          <span className="sr-only">Tìm địa điểm</span>
          <MagnifyingGlass size={20} aria-hidden="true" />
          <input
            id="explore-search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Tên địa điểm, thành phố, trải nghiệm..."
          />
          {query ? (
            <button type="button" aria-label="Xóa từ khóa" onClick={() => updateQuery('')}>
              <X size={18} />
            </button>
          ) : null}
        </label>

        <div className="filter-row">
          <div className="filter-group" role="group" aria-label="Chọn vùng">
            <FunnelSimple size={18} aria-hidden="true" />
            {regions.map((item) => (
              <button
                className={region === item ? 'filter-chip active' : 'filter-chip'}
                type="button"
                key={item}
                onClick={() => setRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="button button-secondary map-toggle" type="button" onClick={() => setShowMap((value) => !value)}>
            <MapTrifold size={19} /> {showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
          </button>
        </div>

        <div className="category-scroller" role="group" aria-label="Chọn loại trải nghiệm">
          {categories.map((item) => (
            <button
              className={category === item ? 'category-tab active' : 'category-tab'}
              type="button"
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className={showMap ? 'explore-layout with-map' : 'explore-layout'}>
        <section className="results-section" aria-labelledby="results-heading">
          <div className="results-heading">
            <h2 id="results-heading">
              {placesQuery.data ? `${placesQuery.data.length} địa điểm phù hợp` : 'Đang tìm địa điểm'}
            </h2>
            {(query || region !== 'Tất cả' || category !== 'Tất cả') ? (
              <button type="button" onClick={resetFilters}>Xóa bộ lọc</button>
            ) : null}
          </div>

          {placesQuery.isPending ? (
            <div className="results-grid" aria-label="Đang tải kết quả">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="skeleton skeleton-card" key={index} />
              ))}
            </div>
          ) : null}

          {placesQuery.isError ? (
            <InlineState
              title="Không thể tải địa điểm"
              description="Hãy kiểm tra kết nối và thử lại."
              actionLabel="Tải lại"
              onAction={() => void placesQuery.refetch()}
            />
          ) : null}

          {placesQuery.data?.length === 0 ? (
            <InlineState
              title="Chưa tìm thấy nơi phù hợp"
              description="Thử đổi vùng, loại trải nghiệm hoặc dùng từ khóa ngắn hơn."
              actionLabel="Xóa bộ lọc"
              onAction={resetFilters}
            />
          ) : null}

          {placesQuery.data && placesQuery.data.length > 0 ? (
            <div className="results-grid">
              {placesQuery.data.map((place) => <PlaceCard key={place.id} place={place} />)}
            </div>
          ) : null}
        </section>

        {showMap ? (
          <Suspense fallback={<div className="skeleton map-skeleton" aria-label="Đang tải bản đồ" />}>
            <MapPanel places={placesQuery.data ?? []} />
          </Suspense>
        ) : null}
      </div>
    </main>
  )
}

export default ExplorePage
