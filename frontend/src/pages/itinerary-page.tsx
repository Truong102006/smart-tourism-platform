import {
  CalendarBlank,
  Clock,
  MapPin,
  Plus,
  Path as RouteIcon,
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
    placesQuery.data?.filter((place) => !itinerary.some((item) => item.placeId === place.id)).slice(0, 3) ?? []

  return (
    <main className="itinerary-page page-shell">
      <header className="itinerary-heading">
        <div className="page-heading compact-page-heading">
          <p className="eyebrow">Chuyến đi của bạn</p>
          <h1>Ba ngày đi theo nhịp riêng.</h1>
          <p>Gom nơi muốn đến, chia theo ngày và điều chỉnh bất cứ lúc nào.</p>
        </div>
        <div className="trip-stat">
          <RouteIcon size={24} weight="duotone" />
          <span>Đã chọn</span>
          <strong>{itinerary.length} điểm</strong>
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
          description="Kết nối đang gián đoạn. Bạn có thể thử lại ngay."
          actionLabel="Tải lại"
          onAction={() => void placesQuery.refetch()}
        />
      ) : null}

      {placesQuery.data ? (
        <div className="itinerary-layout">
          <section className="day-list" aria-label="Các ngày trong lịch trình">
            {tripDays.map((day) => {
              const dayItems = itinerary.filter((item) => item.day === day)

              return (
                <article className="day-section" key={day}>
                  <header>
                    <span>Ngày {day}</span>
                    <strong>{dayItems.length} điểm</strong>
                  </header>

                  {dayItems.length === 0 ? (
                    <div className="day-empty">
                      <CalendarBlank size={24} weight="duotone" />
                      <p>Chưa có điểm dừng. Thêm một gợi ý từ cột bên cạnh.</p>
                    </div>
                  ) : (
                    <div className="trip-item-list">
                      {dayItems.map((item) => {
                        const place = placeById.get(item.placeId)
                        if (!place) return null

                        return (
                          <div className="trip-item" key={item.placeId}>
                            <img src={place.image} alt="" width={160} height={120} />
                            <div className="trip-item-copy">
                              <Link to={`/dia-diem/${place.slug}`}>{place.name}</Link>
                              <span><MapPin size={15} /> {place.city}</span>
                              <span><Clock size={15} /> {place.duration}</span>
                            </div>
                            <div className="trip-item-actions">
                              <label className="sr-only" htmlFor={`day-${place.id}`}>Chuyển {place.name} sang ngày</label>
                              <select
                                id={`day-${place.id}`}
                                value={item.day}
                                onChange={(event) => moveToDay(place.id, Number(event.target.value))}
                              >
                                {tripDays.map((targetDay) => (
                                  <option key={targetDay} value={targetDay}>Ngày {targetDay}</option>
                                ))}
                              </select>
                              <button
                                className="icon-button danger-button"
                                type="button"
                                aria-label={`Xóa ${place.name} khỏi lịch trình`}
                                onClick={() => removeFromItinerary(place.id)}
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </article>
              )
            })}
          </section>

          <aside className="recommendations-panel" aria-labelledby="recommendations-heading">
            <div>
              <h2 id="recommendations-heading">Gợi ý để thêm</h2>
              <p>Chọn một điểm và xếp vào ngày đầu tiên. Bạn có thể đổi ngày sau.</p>
            </div>
            {recommendations.length > 0 ? (
              <div className="recommendation-list">
                {recommendations.map((place) => (
                  <article key={place.id}>
                    <img src={place.image} alt="" width={120} height={90} loading="lazy" />
                    <div>
                      <strong>{place.name}</strong>
                      <span>{place.city}</span>
                    </div>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`Thêm ${place.name} vào ngày 1`}
                      onClick={() => addToItinerary(place.id)}
                    >
                      <Plus size={19} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="all-added">Bạn đã thêm tất cả gợi ý mẫu.</p>
            )}
            <Link className="button button-secondary full-width" to="/kham-pha">
              Tìm thêm địa điểm
            </Link>
          </aside>
        </div>
      ) : null}
    </main>
  )
}

export default ItineraryPage
