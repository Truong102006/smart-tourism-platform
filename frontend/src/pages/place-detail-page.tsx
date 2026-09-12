import {
  ArrowLeft,
  CalendarPlus,
  Check,
  Clock,
  Heart,
  MapPin,
  Sparkle,
  Star,
} from '@phosphor-icons/react'
import { Link, useParams } from 'react-router'
import { InlineState } from '@/components/feedback/inline-state'
import { usePlace } from '@/features/places/hooks/use-places'
import { useTrip } from '@/features/trip/context/trip-store'

export const PlaceDetailPage: React.FC = () => {
  const { slug = '' } = useParams()
  const placeQuery = usePlace(slug)
  const { favoriteIds, itinerary, toggleFavorite, addToItinerary } = useTrip()
  const place = placeQuery.data
  const isFavorite = place ? favoriteIds.includes(place.id) : false
  const isPlanned = place ? itinerary.some((item) => item.placeId === place.id) : false

  return (
    <main className="detail-page page-shell">
      <Link className="back-link" to="/kham-pha">
        <ArrowLeft size={18} /> Quay lại khám phá
      </Link>

      {placeQuery.isPending ? (
        <div className="detail-skeleton" aria-label="Đang tải địa điểm">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-detail-image" />
        </div>
      ) : null}

      {placeQuery.isError ? (
        <InlineState
          title="Không thể tải thông tin"
          description="Kết nối đang gián đoạn. Bạn có thể thử lại ngay."
          actionLabel="Tải lại"
          onAction={() => void placeQuery.refetch()}
        />
      ) : null}

      {!placeQuery.isPending && !placeQuery.isError && !place ? (
        <InlineState
          title="Không tìm thấy địa điểm"
          description="Địa điểm này có thể đã được đổi tên hoặc tạm ẩn."
        />
      ) : null}

      {place ? (
        <article>
          <header className="detail-heading">
            <div>
              <div className="detail-location">
                <MapPin size={18} weight="fill" /> {place.city}, miền {place.region}
              </div>
              <h1>{place.name}</h1>
              <p>{place.shortDescription}</p>
            </div>
            <div className="detail-rating">
              <Star size={20} weight="fill" />
              <strong>{place.rating}</strong>
              <span>{place.reviewCount.toLocaleString('vi-VN')} lượt đánh giá mẫu</span>
            </div>
          </header>

          <figure className="detail-visual">
            <img
              src={place.image}
              alt={`Toàn cảnh ${place.name}`}
              width={1200}
              height={800}
              fetchPriority="high"
            />
            <figcaption>
              <MapPin size={18} weight="fill" />
              <span>{place.address}</span>
            </figcaption>
          </figure>

          <div className="detail-layout">
            <div className="detail-content">
              <section aria-labelledby="about-place">
                <h2 id="about-place">Điều đáng mong đợi</h2>
                <p>{place.description}</p>
                <div className="highlight-grid">
                  {place.highlights.map((highlight) => (
                    <div key={highlight}>
                      <Check size={18} weight="bold" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="good-to-know">
                <h2 id="good-to-know">Thông tin trước khi đi</h2>
                <dl className="info-list">
                  <div>
                    <dt>Địa chỉ</dt>
                    <dd>{place.address}</dd>
                  </div>
                  <div>
                    <dt>Thời lượng gợi ý</dt>
                    <dd>{place.duration}</dd>
                  </div>
                  <div>
                    <dt>Thời điểm phù hợp</dt>
                    <dd>{place.bestTime}</dd>
                  </div>
                  <div>
                    <dt>Chi phí tham khảo</dt>
                    <dd>{place.priceLabel}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <aside className="booking-panel" aria-label="Thêm địa điểm vào chuyến đi">
              <div>
                <Sparkle size={20} weight="fill" />
                <span>Phù hợp với</span>
              </div>
              <div className="tag-list">
                {place.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="booking-summary">
                <span><Clock size={18} /> {place.duration}</span>
                <strong>{place.priceLabel}</strong>
              </div>
              <button
                className="button button-primary full-width"
                type="button"
                disabled={isPlanned}
                onClick={() => addToItinerary(place.id)}
              >
                {isPlanned ? <Check size={20} /> : <CalendarPlus size={20} />}
                {isPlanned ? 'Đã có trong lịch trình' : 'Thêm vào lịch trình'}
              </button>
              <button
                className="button button-secondary full-width"
                type="button"
                aria-pressed={isFavorite}
                onClick={() => toggleFavorite(place.id)}
              >
                <Heart size={20} weight={isFavorite ? 'fill' : 'regular'} />
                {isFavorite ? 'Đã lưu địa điểm' : 'Lưu địa điểm'}
              </button>
              <p>Dữ liệu và mức giá đang dùng để minh họa giao diện.</p>
            </aside>
          </div>
        </article>
      ) : null}
    </main>
  )
}

export default PlaceDetailPage
