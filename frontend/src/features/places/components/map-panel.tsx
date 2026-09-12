import { MapPin } from '@phosphor-icons/react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router'
import type { Place } from '@/features/places/types/place'
import 'leaflet/dist/leaflet.css'

interface MapPanelProps {
  places: Place[]
}

export const MapPanel: React.FC<MapPanelProps> = ({ places }) => {
  const center = places[0]?.coordinates ?? { lat: 16.0471, lng: 108.2068 }

  return (
    <section className="map-panel" aria-labelledby="map-title">
      <div className="map-heading">
        <div>
          <span className="map-heading-icon">
            <MapPin size={18} weight="fill" aria-hidden="true" />
          </span>
          <h2 id="map-title">Xem trên bản đồ</h2>
        </div>
        <span>{places.length} điểm</span>
      </div>
      <MapContainer
        attributionControl={false}
        center={[center.lat, center.lng]}
        zoom={5}
        scrollWheelZoom
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <CircleMarker
            key={place.id}
            center={[place.coordinates.lat, place.coordinates.lng]}
            radius={9}
            pathOptions={{ color: '#f4f6f1', fillColor: '#176b4d', fillOpacity: 1, weight: 3 }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              <Link to={`/dia-diem/${place.slug}`}>Xem chi tiết</Link>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="map-attribution">
        <span>Leaflet</span>
        <span aria-hidden="true">|</span>
        <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>
      </p>
    </section>
  )
}

export default MapPanel
