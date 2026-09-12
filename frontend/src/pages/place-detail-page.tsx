import {
  ArrowLeft,
  CalendarBlank,
  CalendarPlus,
  Check,
  Clock,
  Heart,
  MapPin,
  Sparkle,
  Star,
  Tag,
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
      {/* Back to Explore Navigation */}
      <div className="detail-nav-bar">
        <Link className="back-link group" to="/kham-pha">
          <ArrowLeft size={16} weight="bold" />
          <span>Quay lại khám phá</span>
        </Link>
      </div>

      {placeQuery.isPending ? (
        <div className="detail-skeleton" aria-label="Đang tải thông tin địa điểm">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-detail-image" />
        </div>
      ) : null}

      {placeQuery.isError ? (
        <InlineState
          title="Không thể tải thông tin địa điểm"
          description="Kết nối đang gián đoạn. Bạn có thể thử tải lại ngay."
          actionLabel="Tải lại ngay"
          onAction={() => void placeQuery.refetch()}
        />
      ) : null}

      {!placeQuery.isPending && !placeQuery.isError && !place ? (
        <InlineState
          title="Không tìm thấy địa danh"
          description="Địa danh này có thể đã được cập nhật hoặc tạm ẩn khỏi danh mục."
        />
      ) : null}

      {place ? (
        <article className="detail-article">
          {/* Header section with category and location */}
          <header className="detail-heading-luxury">
            <div className="detail-heading-left">
              <div className="detail-location-pill">
                <MapPin size={15} weight="fill" />
                <span>
                  {place.city} • Miền {place.region}
                </span>
                <span className="detail-cat-badge">
                  <Sparkle size={12} weight="fill" /> {place.category}
                </span>
              </div>
              <h1 className="detail-title">{place.name}</h1>
              <p className="detail-lead">{place.shortDescription}</p>
            </div>

            <div className="detail-rating-card">
              <div className="rating-star-row">
                <Star size={22} weight="fill" className="rating-gold" />
                <span className="rating-number">{place.rating}</span>
              </div>
              <span className="rating-count">
                {place.reviewCount.toLocaleString('vi-VN')} đánh giá thực tế
              </span>
            </div>
          </header>

          {/* Panoramic Hero Image Frame */}
          <figure className="detail-visual-bezel double-bezel-card">
            <div className="card-bezel-outer">
              <div className="card-bezel-inner">
                <div className="detail-img-container">
                  <img
                    src={place.image}
                    alt={`Toàn cảnh ${place.name}`}
                    width={1200}
                    height={800}
                    fetchPriority="high"
                  />
                  <div className="detail-img-gradient" />
                </div>
                <figcaption className="detail-caption-bar">
                  <MapPin size={18} weight="fill" className="text-accent" />
                  <span>{place.address}</span>
                </figcaption>
              </div>
            </div>
          </figure>

          {/* Main Content Layout Grid */}
          <div className="detail-layout-grid">
            {/* Left Content Column */}
            <div className="detail-main-content">
              {/* Story & Highlights Section */}
              <section className="detail-section-card double-bezel-card" aria-labelledby="about-place">
                <div className="card-bezel-outer">
                  <div className="card-bezel-inner section-card-inner">
                    <h2 id="about-place" className="section-subheading">
                      Trải nghiệm & Điểm chạm
                    </h2>
                    <p className="detail-narrative-text">{place.description}</p>

                    <div className="highlights-header">
                      <Sparkle size={16} weight="fill" />
                      <span>Những điều đáng mong đợi nhất</span>
                    </div>

                    <div className="detail-highlights-grid">
                      {place.highlights.map((highlight) => (
                        <div key={highlight} className="highlight-pill-item">
                          <div className="check-circle-icon">
                            <Check size={14} weight="bold" />
                          </div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Travel Advisory Section */}
              <section className="detail-section-card double-bezel-card" aria-labelledby="good-to-know">
                <div className="card-bezel-outer">
                  <div className="card-bezel-inner section-card-inner">
                    <h2 id="good-to-know" className="section-subheading">
                      Thông tin cần biết trước chuyến đi
                    </h2>

                    <div className="advisory-grid">
                      <div className="advisory-item">
                        <CalendarBlank size={20} weight="duotone" className="advisory-icon" />
                        <div>
                          <strong>Thời điểm lý tưởng</strong>
                          <p>{place.bestTime}</p>
                        </div>
                      </div>

                      <div className="advisory-item">
                        <Clock size={20} weight="duotone" className="advisory-icon" />
                        <div>
                          <strong>Thời lượng gợi ý</strong>
                          <p>{place.duration}</p>
                        </div>
                      </div>
                    </div>

                    <div className="tags-block">
                      <div className="tags-label">
                        <Tag size={16} weight="duotone" />
                        <span>Thẻ chủ đề:</span>
                      </div>
                      <div className="detail-tags-list">
                        {place.tags.map((tag) => (
                          <span key={tag} className="tag-capsule">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sticky Booking & Itinerary Actions Card */}
            <aside className="detail-sidebar">
              <div className="sticky-action-card double-bezel-card">
                <div className="card-bezel-outer">
                  <div className="card-bezel-inner action-card-inner">
                    <div className="action-card-top">
                      <span className="action-card-label">Chi phí tham quan</span>
                      <strong className="action-price-hero">{place.priceLabel}</strong>
                    </div>

                    <div className="action-specs-list">
                      <div className="spec-line">
                        <span>Thời lượng đề xuất:</span>
                        <strong>{place.duration}</strong>
                      </div>
                      <div className="spec-line">
                        <span>Vùng địa lý:</span>
                        <strong>Miền {place.region}</strong>
                      </div>
                      <div className="spec-line">
                        <span>Đánh giá từ khách:</span>
                        <strong>{place.rating} / 5.0</strong>
                      </div>
                    </div>

                    <div className="action-buttons-group">
                      <button
                        className={`button button-primary action-cta-btn ${isPlanned ? 'active-planned' : ''}`}
                        type="button"
                        onClick={() => addToItinerary(place.id)}
                      >
                        <CalendarPlus size={18} weight="bold" />
                        <span>{isPlanned ? 'Đã trong lịch trình (Ngày 1)' : 'Thêm vào lịch trình'}</span>
                      </button>

                      <button
                        className={`button button-secondary action-fav-btn ${isFavorite ? 'active-favorite' : ''}`}
                        type="button"
                        onClick={() => toggleFavorite(place.id)}
                      >
                        <Heart size={18} weight={isFavorite ? 'fill' : 'bold'} />
                        <span>{isFavorite ? 'Đã lưu vào bộ sưu tập' : 'Lưu điểm đến này'}</span>
                      </button>
                    </div>

                    <p className="action-disclaimer">
                      ✦ Lịch trình có thể tự do phân chia lại theo từng ngày ở trang Lịch Trình.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>
      ) : null}
    </main>
  )
}

export default PlaceDetailPage
