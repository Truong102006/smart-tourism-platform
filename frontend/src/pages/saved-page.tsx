import { ArrowRight, Heart, HeartBreak, Path as RouteIcon, Sparkle } from '@phosphor-icons/react'
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
      <header className="page-heading saved-page-heading">
        <div className="hero-badge-capsule">
          <Heart size={14} weight="fill" />
          <span>Bộ sưu tập độc bản</span>
        </div>
        <h1 className="saved-title">Những miền đất bạn ấp ủ</h1>
        <p className="saved-subtitle">
          Danh mục tọa độ bạn đã đánh dấu, sẵn sàng chuyển thành lịch trình khám phá thực tế.
        </p>
      </header>

      {placesQuery.isPending ? (
        <div className="saved-grid" aria-label="Đang tải địa điểm đã lưu">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="skeleton skeleton-card" key={index} />
          ))}
        </div>
      ) : null}

      {placesQuery.isError ? (
        <InlineState
          title="Chưa tải được danh sách"
          description="Kết nối đang gián đoạn. Bạn có thể thử lại ngay."
          actionLabel="Tải lại ngay"
          onAction={() => void placesQuery.refetch()}
        />
      ) : null}

      {placesQuery.data && savedPlaces.length === 0 ? (
        <div className="empty-collection-card double-bezel-card">
          <div className="card-bezel-outer">
            <div className="card-bezel-inner empty-collection-inner">
              <div className="empty-icon-circle">
                <HeartBreak size={36} weight="duotone" aria-hidden="true" />
              </div>
              <h2>Bộ sưu tập đang đợi bạn</h2>
              <p>
                Khi lướt qua các điểm đến tuyệt đẹp, chạm vào biểu tượng trái tim để gom góp những vùng đất trong mơ vào đây.
              </p>
              <Link className="button button-primary group" to="/kham-pha">
                <span>Khám phá điểm đến</span>
                <div className="btn-icon-circle">
                  <ArrowRight size={14} weight="bold" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {savedPlaces.length > 0 ? (
        <section aria-labelledby="saved-results-title">
          <div className="collection-summary-bar double-bezel-card">
            <div className="card-bezel-outer">
              <div className="card-bezel-inner summary-bar-inner">
                <div className="summary-left">
                  <Sparkle size={18} weight="fill" className="text-accent" />
                  <h2 id="saved-results-title">{savedPlaces.length} điểm đến đã lưu</h2>
                </div>
                <Link className="button button-primary itinerary-convert-btn group" to="/lich-trinh">
                  <RouteIcon size={16} weight="bold" />
                  <span>Ghép vào lịch trình</span>
                  <div className="btn-icon-circle">
                    <ArrowRight size={13} weight="bold" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="saved-grid">
            {savedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default SavedPage
