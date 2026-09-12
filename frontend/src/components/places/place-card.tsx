import { Heart, MapPin, Star } from '@phosphor-icons/react'
import { memo } from 'react'
import { Link } from 'react-router'
import { useTrip } from '@/features/trip/context/trip-store'
import type { Place } from '@/features/places/types/place'

interface PlaceCardProps {
  place: Place
  featured?: boolean
  priority?: boolean
}

export const PlaceCard = memo<PlaceCardProps>(function PlaceCard({
  place,
  featured = false,
  priority = false,
}) {
  const { favoriteIds, toggleFavorite } = useTrip()
  const isFavorite = favoriteIds.includes(place.id)

  return (
    <article className={featured ? 'place-card place-card-featured' : 'place-card'}>
      <Link className="place-image-wrap" to={`/dia-diem/${place.slug}`}>
        <img
          className="place-image"
          src={place.image}
          alt={`Khung cảnh ${place.name}`}
          width={1200}
          height={900}
          loading={priority ? 'eager' : 'lazy'}
        />
      </Link>
      <button
        className={isFavorite ? 'save-button saved' : 'save-button'}
        type="button"
        aria-label={isFavorite ? `Bỏ lưu ${place.name}` : `Lưu ${place.name}`}
        aria-pressed={isFavorite}
        onClick={() => toggleFavorite(place.id)}
      >
        <Heart size={20} weight={isFavorite ? 'fill' : 'regular'} />
      </button>
      <div className="place-card-body">
        <div className="place-meta">
          <span>
            <MapPin size={16} aria-hidden="true" /> {place.city}
          </span>
          <span>
            <Star size={16} weight="fill" aria-hidden="true" /> {place.rating}
          </span>
        </div>
        <Link to={`/dia-diem/${place.slug}`}>
          <h3>{place.name}</h3>
        </Link>
        <p>{place.shortDescription}</p>
        <div className="place-card-footer">
          <span>{place.duration}</span>
          <strong>{place.priceLabel}</strong>
        </div>
      </div>
    </article>
  )
})
