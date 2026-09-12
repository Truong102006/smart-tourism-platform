import {
  CalendarBlank,
  Clock,
  Compass,
  MapPin,
  Plus,
  Path as RouteIcon,
  Sparkle,
  Trash,
} from '@phosphor-icons/react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { InlineState } from '@/components/feedback/inline-state'
import { usePlaces } from '@/features/places/hooks/use-places'
import { useTrip } from '@/features/trip/context/trip-store'

const tripDays = [1, 2, 3]

export const ItineraryPage: React.FC = () => {
  const placesQuery = usePlaces()
  const { itinerary, addToItinerary, moveToDay, removeFromItinerary } = useTrip()
  const placeById = useMemo(
    () => new Map(placesQuery.data?.map((place) => [place.id, place]) ?? []),
    [placesQuery.data],
  )
  const recommendations =
    placesQuery.data
      ?.filter((place) => !itinerary.some((item) => item.placeId === place.id))
      .slice(0, 3) ?? []

  return (
    <main className="itinerary-page page-shell">
      {/* Page Header */}
      <header className="itinerary-heading-luxury">
        <div className="page-heading-left">
          <div className="hero-badge-capsule">
            <RouteIcon size={14} weight="fill" />
            <span>Kế hoạch hành trình</span>
          </div>
          <h1 className="itinerary-title">Lịch trình 3 ngày theo nhịp riêng</h1>
          <p className="itinerary-subtitle">
            Phân bổ điểm đến hợp lý, cân đối thời gian di chuyển và sẵn sàng linh hoạt thay đổi bất cứ khi nào.
          </p>
        </div>

        <div className="trip-stat-card double-bezel-card">
          <div className="card-bezel-outer">
            <div className="card-bezel-inner stat-card-inner">
              <RouteIcon size={24} weight="duotone" className="text-accent" />
              <div className="stat-text">
                <span className="stat-label">Tổng điểm dừng</span>
                <strong className="stat-value">{itinerary.length} địa điểm</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {placesQuery.isPending ? (
        <div className="itinerary-layout" aria-label="Đang tải lịch trình">
          <div className="skeleton skeleton-itinerary" />
          <div className="skeleton skeleton-itinerary" />
        </div>
      ) : null}

      {placesQuery.isError ? (
        <InlineState
          title="Chưa tải được lịch trình"
          description="Kết nối mạng đang bị gián đoạn. Xin vui lòng thử lại."
          actionLabel="Tải lại ngay"
          onAction={() => void placesQuery.refetch()}
        />
      ) : null}

      {placesQuery.data ? (
        <div className="itinerary-layout-grid">
          {/* Main Column: Day Timeline Sections */}
          <section className="day-list-col" aria-label="Các ngày trong lịch trình">
            {tripDays.map((day) => {
              const dayItems = itinerary.filter((item) => item.day === day)

              return (
                <article className="day-section double-bezel-card" key={day}>
                  <div className="card-bezel-outer">
                    <div className="card-bezel-inner day-card-inner">
                      {/* Day Header Bar */}
                      <header className="day-header-bar">
                        <div className="day-badge-title">
                          <span className="day-number-pill">NGÀY {day}</span>
                          <span className="day-count-tag">{dayItems.length} chặng dừng</span>
                        </div>
                      </header>

                      {/* Day Items or Empty Prompt */}
                      {dayItems.length === 0 ? (
                        <div className="day-empty-state">
                          <CalendarBlank size={24} weight="duotone" className="day-empty-icon" />
                          <p>Chưa có điểm dừng nào cho Ngày {day}. Thêm điểm đến từ cột gợi ý bên phải.</p>
                        </div>
                      ) : (
                        <div className="trip-items-timeline">
                          {dayItems.map((item, index) => {
                            const place = placeById.get(item.placeId)
                            if (!place) return null

                            return (
                              <div className="timeline-trip-item" key={item.placeId}>
                                <div className="timeline-marker">
                                  <div className="timeline-node">{index + 1}</div>
                                  {index < dayItems.length - 1 && <div className="timeline-connector-line" />}
                                </div>

                                <div className="trip-item-card">
                                  <img
                                    src={place.image}
                                    alt={place.name}
                                    width={160}
                                    height={120}
                                    className="trip-item-thumb"
                                  />
                                  <div className="trip-item-details">
                                    <Link to={`/dia-diem/${place.slug}`} className="trip-item-name">
                                      {place.name}
                                    </Link>
                                    <div className="trip-item-meta-row">
                                      <span>
                                        <MapPin size={14} weight="fill" /> {place.city}
                                      </span>
                                      <span>
                                        <Clock size={14} weight="fill" /> {place.duration}
                                      </span>
                                    </div>
                                    <span className="trip-item-price">{place.priceLabel}</span>
                                  </div>

                                  <div className="trip-item-actions-panel">
                                    <label className="sr-only" htmlFor={`day-${place.id}`}>
                                      Chuyển {place.name} sang ngày khác
                                    </label>
                                    <select
                                      id={`day-${place.id}`}
                                      value={item.day}
                                      className="day-switcher-select"
                                      onChange={(event) =>
                                        moveToDay(place.id, Number(event.target.value))
                                      }
                                    >
                                      {tripDays.map((targetDay) => (
                                        <option key={targetDay} value={targetDay}>
                                          Ngày {targetDay}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      type="button"
                                      className="delete-item-btn"
                                      aria-label={`Xóa ${place.name} khỏi lịch trình`}
                                      onClick={() => removeFromItinerary(place.id)}
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          {/* Right Aside: Rhythm Tips & Recommended Places */}
          <aside className="itinerary-sidebar-col">
            {/* Travel Pace Advice */}
            <div className="itinerary-advice-card double-bezel-card">
              <div className="card-bezel-outer">
                <div className="card-bezel-inner advice-inner">
                  <div className="advice-title">
                    <Sparkle size={18} weight="fill" className="text-accent" />
                    <h3>Nhịp đi lý tưởng</h3>
                  </div>
                  <p>
                    Mỗi ngày chỉ nên xếp 2-3 điểm đến chính. Để dành những khoảng trống cho ẩm thực ngẫu hứng và nghỉ ngơi tự nhiên.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations Drawer */}
            <div className="itinerary-rec-card double-bezel-card">
              <div className="card-bezel-outer">
                <div className="card-bezel-inner rec-inner">
                  <div className="rec-header">
                    <Compass size={18} weight="duotone" className="text-accent" />
                    <h3>Gợi ý thêm vào</h3>
                  </div>
                  <div className="rec-places-list">
                    {recommendations.map((place) => (
                      <div className="rec-item-row" key={place.id}>
                        <img
                          src={place.image}
                          alt={place.name}
                          width={64}
                          height={64}
                          className="rec-item-thumb"
                        />
                        <div className="rec-item-text">
                          <Link to={`/dia-diem/${place.slug}`} className="rec-name">
                            {place.name}
                          </Link>
                          <span className="rec-city">{place.city}</span>
                        </div>
                        <button
                          type="button"
                          className="add-to-trip-btn"
                          aria-label={`Thêm ${place.name} vào lịch trình`}
                          onClick={() => addToItinerary(place.id)}
                        >
                          <Plus size={16} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  )
}

export default ItineraryPage
