import { ArrowRight, Heart, MapPin, Sparkle, Star } from '@phosphor-icons/react'
import { memo, useRef, useState } from 'react'
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
  const cardRef = useRef<HTMLElement>(null)
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({})

  // 3D subtle card tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
    })
  }

  return (
    <article
      ref={cardRef}
      className={`place-card double-bezel-card ${featured ? 'place-card-featured' : ''}`}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer Shell Wrapper for Double-Bezel */}
      <div className="card-bezel-outer">
        <div className="card-bezel-inner">
          {/* Image Canvas Container */}
          <div className="place-image-wrap">
            <Link to={`/dia-diem/${place.slug}`} aria-label={`Xem chi tiết ${place.name}`}>
              <img
                className="place-image"
                src={place.image}
                alt={`Khung cảnh tại ${place.name}`}
                width={1200}
                height={900}
                loading={priority ? 'eager' : 'lazy'}
              />
              <div className="place-image-gradient-overlay" />
            </Link>

            {/* Floating Top Pills */}
            <div className="place-floating-tags">
              <span className="place-category-pill">
                <Sparkle size={12} weight="fill" />
                <span>{place.category}</span>
              </span>
              <span className="place-region-pill">
                Miền {place.region}
              </span>
            </div>

            {/* Magnetic Glass Favorite Button */}
            <button
              className={`save-button ${isFavorite ? 'saved' : ''}`}
              type="button"
              aria-label={isFavorite ? `Bỏ lưu ${place.name}` : `Lưu ${place.name}`}
              aria-pressed={isFavorite}
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite(place.id)
              }}
            >
              <Heart
                size={18}
                weight={isFavorite ? 'fill' : 'bold'}
                className={isFavorite ? 'heart-bounce' : ''}
              />
            </button>
          </div>

          {/* Card Information Body */}
          <div className="place-card-body">
            <div className="place-meta">
              <span className="place-meta-city">
                <MapPin size={15} weight="fill" /> {place.city}
              </span>
              <span className="place-meta-rating">
                <Star size={14} weight="fill" />
                <strong>{place.rating}</strong>
                <small>({place.reviewCount})</small>
              </span>
            </div>

            <Link to={`/dia-diem/${place.slug}`} className="place-card-title-link">
              <h3 className="place-card-title">{place.name}</h3>
            </Link>

            <p className="place-card-desc">{place.shortDescription}</p>

            {/* Card Footer with Price & Interactive Action */}
            <div className="place-card-footer">
              <div className="place-footer-left">
                <span className="place-duration-tag">{place.duration}</span>
                <strong className="place-price-pill">{place.priceLabel}</strong>
              </div>

              <Link
                to={`/dia-diem/${place.slug}`}
                className="place-detail-arrow-btn"
                aria-label={`Khám phá ${place.name}`}
              >
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
})
