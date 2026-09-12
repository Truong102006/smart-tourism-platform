import {
  ArrowRight,
  BowlFood,
  Buildings,
  Compass,
  Leaf,
  MagnifyingGlass,
  PaintBrushBroad,
  Path as RouteIcon,
  Sparkle,
} from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { InlineState } from '@/components/feedback/inline-state'
import { PlaceCard } from '@/components/places/place-card'
import { HeroGlobe } from '@/components/three/hero-globe'
import { usePlaces } from '@/features/places/hooks/use-places'

const experiences = [
  {
    icon: BowlFood,
    title: 'Ẩm thực bản địa chuẩn vị',
    text: 'Len lỏi các ngõ hẻm phố cổ, thưởng thức hương vị mộc mạc theo từng mùa trong năm.',
    badge: 'Vị giác',
  },
  {
    icon: Buildings,
    title: 'Dấu ấn di sản ngàn năm',
    text: 'Hành trình ngược dòng lịch sử chạm vào đền đài, cung điện và tinh hoa kiến trúc triều đại.',
    badge: 'Ký ức',
  },
  {
    icon: Leaf,
    title: 'Thiên nhiên nguyên bản',
    text: 'Thả mình vào rừng thông bạt ngàn, suối thác tĩnh lặng và những cung đường biển hùng vĩ.',
    badge: 'Tĩnh lặng',
  },
  {
    icon: PaintBrushBroad,
    title: 'Gặp gỡ nghệ nhân làng nghề',
    text: 'Lắng nghe chuyện đời chuyện nghề, tự tay chạm khắc và tạo tác sản phẩm thủ công.',
    badge: 'Sáng tạo',
  },
]

const quickTags = ['Phố cổ Hội An', 'Hồ Tuyền Lâm', 'Đại Nội Huế', 'Tràng An', 'Di sản']

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

  const handleQuickTagClick = (tag: string) => {
    navigate(`/kham-pha?q=${encodeURIComponent(tag)}`)
  }

  return (
    <main className="home-main">
      {/* ─── Hero Section with 3D Globe ─── */}
      <section className="hero-section">
        {/* Background ambient radial mesh glows */}
        <div className="hero-ambient-glow" />
        <div className="hero-ambient-glow-secondary" />

        <div className="hero-grid page-shell">
          {/* Left Column: Editorial Copy & Search */}
          <div className="hero-copy reveal-in">
            <div className="hero-badge-capsule">
              <span className="hero-badge-sparkle">
                <Sparkle size={13} weight="fill" />
              </span>
              <span className="hero-badge-text">Tuyển chọn điểm đến độc bản Việt Nam</span>
            </div>

            <h1 className="hero-heading">
              Mỗi chuyến đi là một bản giao hưởng{' '}
              <span className="hero-heading-italic">vừa gu.</span>
            </h1>

            <p className="hero-lead">
              Khám phá không gian 3D tương tác, đắm chìm trong di sản và tự do kiến tạo hành trình riêng cho tâm hồn bạn.
            </p>

            {/* Glass Search Capsule */}
            <form className="hero-search-capsule" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <MagnifyingGlass size={20} className="search-icon" aria-hidden="true" />
                <input
                  id="home-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Hội An, Đà Lạt, chèo SUP, di sản..."
                  aria-label="Tìm kiếm điểm đến tại Việt Nam"
                />
              </div>
              <button type="submit" className="search-submit-btn">
                <span>Khám phá</span>
                <div className="btn-icon-circle">
                  <ArrowRight size={14} weight="bold" />
                </div>
              </button>
            </form>

            {/* Quick Inspiration Tags */}
            <div className="hero-quick-tags">
              <span className="quick-tag-label">Gợi ý nhanh:</span>
              <div className="quick-tags-list">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="quick-tag-btn"
                    onClick={() => handleQuickTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Stats Row */}
            <div className="hero-metrics-row">
              <div className="metric-item">
                <span className="metric-number">06+</span>
                <span className="metric-caption">Tọa độ độc bản</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-number">4.8★</span>
                <span className="metric-caption">Hài lòng tuyệt đối</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-number">100%</span>
                <span className="metric-caption">Cảm hứng chân thật</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Three.js Globe */}
          <div className="hero-visual-wrapper reveal-in-delayed">
            <HeroGlobe />
          </div>
        </div>
      </section>

      {/* ─── Curated Destinations Bento Section ─── */}
      <section className="section page-shell" aria-labelledby="featured-heading">
        <div className="section-header-row">
          <div className="section-heading stacked-heading">
            <span className="eyebrow">Bộ sưu tập mùa này</span>
            <h2 id="featured-heading">Những miền đất chạm tới cảm xúc</h2>
            <p>Tuyển tập địa danh được sàng lọc kỹ lưỡng dựa trên nhịp đi, khí hậu và chất thơ nguyên bản.</p>
          </div>

          <Link className="view-all-pill-btn group" to="/kham-pha">
            <span>Xem tất cả điểm đến</span>
            <div className="btn-icon-circle">
              <ArrowRight size={14} weight="bold" />
            </div>
          </Link>
        </div>

        {placesQuery.isPending ? (
          <div className="featured-bento-grid" aria-label="Đang tải địa điểm">
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
          <div className="featured-bento-grid">
            {placesQuery.data.slice(0, 5).map((place, index) => (
              <PlaceCard
                key={place.id}
                place={place}
                featured={index === 0}
                priority={index === 0}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* ─── Editorial Philosophy & Experiences ─── */}
      <section className="experience-section" aria-labelledby="experience-heading">
        <div className="page-shell">
          <div className="experience-header-center">
            <div className="hero-badge-capsule">
              <Compass size={14} weight="fill" />
              <span>Triết lý hành trình</span>
            </div>
            <h2 id="experience-heading">Vượt lên trên một khung hình check-in</h2>
            <p className="experience-subtext">
              Chúng tôi tin rằng giá trị lớn nhất của du lịch là sự hòa nhịp cùng văn hóa, con người và cộng đồng sở tại.
            </p>
          </div>

          <div className="experience-grid">
            {experiences.map(({ icon: Icon, title, text, badge }) => (
              <article className="experience-card double-bezel-card" key={title}>
                <div className="card-bezel-outer">
                  <div className="card-bezel-inner experience-card-inner">
                    <div className="experience-icon-top">
                      <div className="experience-icon-box">
                        <Icon size={28} weight="duotone" />
                      </div>
                      <span className="experience-category-tag">{badge}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Premium Trip Builder Callout ─── */}
      <section className="section page-shell" aria-labelledby="plan-heading">
        <div className="plan-callout-luxury double-bezel-card">
          <div className="card-bezel-outer">
            <div className="card-bezel-inner plan-callout-inner">
              <div className="plan-callout-copy">
                <div className="plan-tag">
                  <RouteIcon size={18} weight="fill" />
                  <span>Trình soạn lịch trình thông minh</span>
                </div>
                <h2 id="plan-heading">Lịch trình đủ sâu để cảm, đủ thoáng để đổi ý.</h2>
                <p>
                  Tự do lưu trữ các điểm dừng yêu thích, phân chia theo từng ngày và ngắm nhìn bản đồ di chuyển liền mạch.
                </p>
                <div className="plan-cta-row">
                  <Link className="button button-primary group" to="/lich-trinh">
                    <span>Kiến tạo lịch trình ngay</span>
                    <div className="btn-icon-circle">
                      <ArrowRight size={14} weight="bold" />
                    </div>
                  </Link>
                  <Link className="button button-secondary" to="/kham-pha">
                    Xem gợi ý cung đường
                  </Link>
                </div>
              </div>

              <aside className="trip-preview-luxury" aria-label="Gợi ý lịch trình di sản">
                <div className="trip-preview-header">
                  <div className="trip-preview-badge">3 NGÀY TRỌN VẸN</div>
                  <strong className="trip-preview-title">Hành trình Di sản Miền Trung</strong>
                </div>

                <div className="trip-timeline-preview">
                  <div className="timeline-item-row">
                    <div className="timeline-bullet" />
                    <div className="timeline-body">
                      <span className="timeline-time">08:00 • Ngày 1</span>
                      <strong>Bán đảo Sơn Trà</strong>
                      <p>Khởi hành đón bình minh và rừng nguyên sinh</p>
                    </div>
                  </div>

                  <div className="timeline-item-row">
                    <div className="timeline-bullet" />
                    <div className="timeline-body">
                      <span className="timeline-time">14:30 • Ngày 1</span>
                      <strong>Phố cổ Hội An</strong>
                      <p>Thả bộ ngắm lồng đèn và cà phê bên sông Hoài</p>
                    </div>
                  </div>

                  <div className="timeline-item-row">
                    <div className="timeline-bullet" />
                    <div className="timeline-body">
                      <span className="timeline-time">09:00 • Ngày 2</span>
                      <strong>Đại Nội Kinh thành Huế</strong>
                      <p>Chiêm ngưỡng kiến trúc cung đình triều Nguyễn</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
