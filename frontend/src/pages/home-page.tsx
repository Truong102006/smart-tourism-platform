import {
  ArrowRight,
  BowlFood,
  Buildings,
  Leaf,
  MagnifyingGlass,
  PaintBrushBroad,
  Path as RouteIcon,
} from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { InlineState } from '@/components/feedback/inline-state'
import { PlaceCard } from '@/components/places/place-card'
import { usePlaces } from '@/features/places/hooks/use-places'

const experiences = [
  { icon: BowlFood, title: 'Ăn như người địa phương', text: 'Quán nhỏ, chợ sớm và món ăn theo mùa.' },
  { icon: Buildings, title: 'Chạm vào di sản', text: 'Kiến trúc, làng nghề và câu chuyện bản địa.' },
  { icon: Leaf, title: 'Ra ngoài thành phố', text: 'Cung đường xanh vừa sức cho một ngày.' },
  { icon: PaintBrushBroad, title: 'Gặp người làm nghề', text: 'Xưởng thủ công và không gian sáng tạo.' },
]

export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const placesQuery = usePlaces()

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/kham-pha${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy reveal-in">
          <p className="eyebrow">Khám phá Việt Nam theo cách của bạn</p>
          <h1>Mỗi chuyến đi bắt đầu từ một nơi vừa gu.</h1>
          <p className="hero-lead">
            Tìm nơi hợp gu, khám phá dịch vụ địa phương và ghép thành chuyến đi của riêng bạn.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="home-search">
              Bạn muốn đi đâu?
            </label>
            <MagnifyingGlass size={22} aria-hidden="true" />
            <input
              id="home-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Thử tìm Hội An, thiên nhiên..."
            />
            <button type="submit">Khám phá</button>
          </form>
        </div>
        <div className="hero-visual reveal-in-delayed">
          <img
            src="/images/hero-vietnam.webp"
            alt="Du khách trẻ khám phá một khu phố Việt Nam sau cơn mưa"
            width={1120}
            height={1400}
            fetchPriority="high"
          />
          <div className="hero-place-note">
            <span>Gợi ý hôm nay</span>
            <strong>Một sáng đi chậm ở Hà Nội</strong>
          </div>
        </div>
      </section>

      <section className="section page-shell" aria-labelledby="featured-heading">
        <div className="section-heading stacked-heading">
          <h2 id="featured-heading">Nơi đáng ghé mùa này</h2>
          <p>Gợi ý mẫu dựa trên nhịp đi, sở thích và thời gian bạn có.</p>
        </div>

        {placesQuery.isPending ? (
          <div className="featured-grid" aria-label="Đang tải địa điểm">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="skeleton skeleton-card" key={index} />
            ))}
          </div>
        ) : null}

        {placesQuery.isError ? (
          <InlineState
            title="Chưa tải được gợi ý"
            description="Kết nối đang gián đoạn. Bạn có thể thử lại ngay."
            actionLabel="Tải lại"
            onAction={() => void placesQuery.refetch()}
          />
        ) : null}

        {placesQuery.data ? (
          <div className="featured-grid">
            {placesQuery.data.slice(0, 5).map((place, index) => (
              <PlaceCard key={place.id} place={place} featured={index === 0} priority={index === 0} />
            ))}
          </div>
        ) : null}

        <div className="section-action">
          <Link className="text-link" to="/kham-pha">
            Xem tất cả địa điểm <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="experience-section" aria-labelledby="experience-heading">
        <div className="page-shell">
          <div className="section-heading stacked-heading">
            <h2 id="experience-heading">Đi sâu hơn một tấm ảnh đẹp</h2>
            <p>Tìm những trải nghiệm giúp tiền và thời gian ở lại lâu hơn trong cộng đồng.</p>
          </div>
          <div className="experience-list">
            {experiences.map(({ icon: Icon, title, text }) => (
              <article className="experience-item" key={title}>
                <Icon size={28} weight="duotone" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section page-shell" aria-labelledby="plan-heading">
        <div className="plan-callout">
          <div className="plan-callout-copy">
            <RouteIcon size={34} weight="duotone" aria-hidden="true" />
            <h2 id="plan-heading">Lịch trình đủ rõ để đi, đủ thoáng để đổi ý.</h2>
            <p>Lưu địa điểm, chia theo ngày và xem nhịp di chuyển trong cùng một nơi.</p>
            <Link className="button button-primary" to="/lich-trinh">
              Tạo lịch trình
            </Link>
          </div>
          <aside className="trip-preview" aria-label="Ví dụ lịch trình Đà Nẵng và Hội An">
            <div className="trip-preview-header">
              <span>3 ngày</span>
              <strong>Đà Nẵng và Hội An</strong>
            </div>
            <ol>
              <li>
                <span>08:30</span>
                <div>
                  <strong>Bán đảo Sơn Trà</strong>
                  <small>Khởi hành sớm, đi khoảng 3 giờ</small>
                </div>
              </li>
              <li>
                <span>15:00</span>
                <div>
                  <strong>Phố cổ Hội An</strong>
                  <small>Đi bộ và ăn tối ven sông</small>
                </div>
              </li>
            </ol>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default HomePage
