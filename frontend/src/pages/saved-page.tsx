import { ArrowRight, HeartBreak } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { InlineState } from '@/components/feedback/inline-state'
import { PlaceCard } from '@/components/places/place-card'
import { usePlaces } from '@/features/places/hooks/use-places'
import { useTrip } from '@/features/trip/context/trip-store'

export const SavedPage: React.FC = () => {
  const { favoriteIds } = useTrip()
  const placesQuery = usePlaces()
  const savedPlaces = placesQuery.data?.filter((place) => favoriteIds.includes(place.id)) ?? []

  return (
    <main className="saved-page page-shell">
      <header className="page-heading compact-page-heading">
        <p className="eyebrow">Bộ sưu tập của bạn</p>
        <h1>Những nơi muốn ghé.</h1>
        <p>Lưu lại khi đang xem, quyết định sau khi đã có đủ cảm hứng.</p>
      </header>

      {placesQuery.isPending ? (
        <div className="saved-grid" aria-label="Đang tải địa điểm đã lưu">
          {Array.from({ length: 3 }, (_, index) => <div className="skeleton skeleton-card" key={index} />)}
        </div>
      ) : null}

      {placesQuery.isError ? (
        <InlineState
          title="Chưa tải được danh sách"
          description="Kết nối đang gián đoạn. Bạn có thể thử lại ngay."
          actionLabel="Tải lại"
          onAction={() => void placesQuery.refetch()}
        />
      ) : null}

      {placesQuery.data && savedPlaces.length === 0 ? (
        <div className="empty-collection">
          <HeartBreak size={42} weight="duotone" aria-hidden="true" />
          <h2>Bộ sưu tập đang trống</h2>
          <p>Khi thấy một nơi thú vị, nhấn biểu tượng trái tim để giữ lại ở đây.</p>
          <Link className="button button-primary" to="/kham-pha">
            Tìm cảm hứng <ArrowRight size={18} />
          </Link>
        </div>
      ) : null}

      {savedPlaces.length > 0 ? (
        <section aria-labelledby="saved-results-title">
          <div className="collection-summary">
            <h2 id="saved-results-title">{savedPlaces.length} địa điểm</h2>
            <Link className="text-link" to="/lich-trinh">Ghép vào lịch trình <ArrowRight size={18} /></Link>
          </div>
          <div className="saved-grid">
            {savedPlaces.map((place) => <PlaceCard key={place.id} place={place} />)}
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default SavedPage
