import {
  Compass,
  FunnelSimple,
  MagnifyingGlass,
  MapPin,
  MapTrifold,
  Sparkle,
  X,
} from '@phosphor-icons/react'
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

  const resultCount = placesQuery.data?.length ?? 0

  return (
    <main className="explore-page page-shell">
      {/* ─── Explore Header ─── */}
      <header className="page-heading explore-page-heading">
        <div className="hero-badge-capsule">
          <Compass size={14} weight="fill" />
          <span>Bản đồ tọa độ Việt Nam</span>
        </div>
        <h1 className="explore-title">Khám phá miền đất vừa gu</h1>
        <p className="explore-subtitle">
          Lọc theo vùng miền, danh mục cảm xúc hoặc tìm kiếm điểm đến bạn hằng ấp ủ.
        </p>
      </header>

      {/* ─── Luxury Filter Bar & Controls ─── */}
      <section className="explore-filter-panel double-bezel-card" aria-label="Bộ lọc địa điểm">
        <div className="card-bezel-outer">
          <div className="card-bezel-inner filter-inner-content">
            {/* Search Input Box */}
            <div className="explore-search-shell">
              <MagnifyingGlass size={20} className="search-icon" aria-hidden="true" />
              <input
                id="explore-search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Tìm Hội An, Tràng An, chèo SUP, ẩm thực..."
                aria-label="Tìm kiếm địa danh hoặc trải nghiệm"
              />
              {query ? (
                <button
                  type="button"
                  className="search-clear-btn"
                  aria-label="Xóa từ khóa"
                  onClick={() => updateQuery('')}
                >
                  <X size={16} weight="bold" />
                </button>
              ) : null}
            </div>

            {/* Region Filter Pills & Map Toggle */}
            <div className="filter-controls-row">
              <div className="region-filter-group" role="group" aria-label="Chọn vùng miền">
                <span className="filter-group-label">
                  <FunnelSimple size={16} aria-hidden="true" /> Vùng:
                </span>
                {regions.map((item) => (
                  <button
                    className={`filter-chip ${region === item ? 'active' : ''}`}
                    type="button"
                    key={item}
                    onClick={() => setRegion(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                className={`button button-secondary map-toggle-btn ${showMap ? 'active' : ''}`}
                type="button"
                onClick={() => setShowMap((value) => !value)}
              >
                <MapTrifold size={18} weight="duotone" />
                <span>{showMap ? 'Thu gọn bản đồ' : 'Mở bản đồ'}</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="category-filter-row" role="group" aria-label="Chọn loại trải nghiệm">
              <span className="filter-group-label">
                <Sparkle size={16} aria-hidden="true" /> Thể loại:
              </span>
              <div className="category-scroll-list">
                {categories.map((item) => (
                  <button
                    className={`category-tab-pill ${category === item ? 'active' : ''}`}
                    type="button"
                    key={item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map Panel Section (if toggled) ─── */}
      {showMap && (
        <section className="explore-map-section double-bezel-card" aria-label="Bản đồ địa điểm">
          <div className="card-bezel-outer">
            <div className="card-bezel-inner map-container-inner">
              <Suspense
                fallback={
                  <div className="map-placeholder-luxury">
                    <MapPin size={32} weight="duotone" className="pulse-icon" />
                    <span>Đang khởi tạo bản đồ không gian...</span>
                  </div>
                }
              >
                <MapPanel places={placesQuery.data ?? []} />
              </Suspense>
            </div>
          </div>
        </section>
      )}

      {/* ─── Results Summary Bar ─── */}
      <div className="explore-results-bar">
        <div className="results-count">
          <span>Tìm thấy </span>
          <strong>{resultCount} địa điểm</strong>
          {region !== 'Tất cả' && <span className="active-filter-tag">• Miền {region}</span>}
          {category !== 'Tất cả' && <span className="active-filter-tag">• {category}</span>}
        </div>

        {(query || region !== 'Tất cả' || category !== 'Tất cả') && (
          <button type="button" className="reset-filter-btn" onClick={resetFilters}>
            <X size={14} weight="bold" /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* ─── Place Cards Grid ─── */}
      {placesQuery.isPending ? (
        <div className="explore-grid" aria-label="Đang tải danh sách địa điểm">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="skeleton skeleton-card" key={index} />
          ))}
        </div>
      ) : null}

      {placesQuery.isError ? (
        <InlineState
          title="Không thể tải danh sách"
          description="Kết nối mạng đang bị gián đoạn. Xin vui lòng thử lại."
          actionLabel="Tải lại ngay"
          onAction={() => void placesQuery.refetch()}
        />
      ) : null}

      {placesQuery.data && placesQuery.data.length === 0 ? (
        <div className="explore-empty-state double-bezel-card">
          <div className="card-bezel-outer">
            <div className="card-bezel-inner empty-state-inner">
              <Compass size={48} weight="duotone" className="empty-state-icon" />
              <h3>Không tìm thấy địa điểm phù hợp</h3>
              <p>Thử tìm từ khóa rộng hơn như &quot;di sản&quot;, &quot;thiên nhiên&quot; hoặc xóa các bộ lọc hiện tại.</p>
              <button type="button" className="button button-primary" onClick={resetFilters}>
                Xem tất cả địa điểm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {placesQuery.data && placesQuery.data.length > 0 ? (
        <div className="explore-grid">
          {placesQuery.data.map((place, index) => (
            <PlaceCard key={place.id} place={place} priority={index < 3} />
          ))}
        </div>
      ) : null}
    </main>
  )
}

export default ExplorePage
