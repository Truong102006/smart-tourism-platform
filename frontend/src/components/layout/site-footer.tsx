import {
  ArrowUpRight,
  Compass,
  EnvelopeSimple,
  GlobeHemisphereWest,
  Heart,
  InstagramLogo,
  MapPin,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'

export const SiteFooter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-gradient-divider" />
      <div className="footer-inner">
        <div className="footer-top-grid">
          {/* Col 1: Brand & Philosophy */}
          <div className="footer-brand-col">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark-glow">
                <Compass size={22} weight="fill" className="compass-icon" aria-hidden="true" />
              </span>
              <div className="brand-text-group">
                <span className="brand-title">Đi Đây</span>
                <span className="brand-tagline">VIETNAM SANCTUARY</span>
              </div>
            </Link>
            <p className="footer-manifesto">
              Nền tảng trải nghiệm du lịch số kết hợp công nghệ 3D không gian và thẩm mỹ đương đại, đưa bạn chạm vào chiều sâu văn hóa và cảnh sắc nguyên bản của Việt Nam.
            </p>
            <div className="footer-social-row">
              <a href="#instagram" aria-label="Instagram" className="social-circle">
                <InstagramLogo size={18} weight="bold" />
              </a>
              <a href="#globe" aria-label="Website quốc tế" className="social-circle">
                <GlobeHemisphereWest size={18} weight="bold" />
              </a>
              <a href="#locations" aria-label="Bản đồ các vùng" className="social-circle">
                <MapPin size={18} weight="bold" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Khám phá</h4>
            <nav className="footer-nav-links" aria-label="Liên kết hành trình">
              <Link to="/kham-pha" className="footer-link">
                <span>Tất cả điểm đến</span>
                <ArrowUpRight size={14} className="link-arrow" />
              </Link>
              <Link to="/kham-pha?q=Di+s%E1%BA%A3n" className="footer-link">
                <span>Di sản văn hóa</span>
                <ArrowUpRight size={14} className="link-arrow" />
              </Link>
              <Link to="/kham-pha?q=Thi%C3%AAn+nhi%C3%AAn" className="footer-link">
                <span>Thiên nhiên nguyên bản</span>
                <ArrowUpRight size={14} className="link-arrow" />
              </Link>
              <Link to="/lich-trinh" className="footer-link">
                <span>Tạo lịch trình mẫu</span>
                <ArrowUpRight size={14} className="link-arrow" />
              </Link>
              <Link to="/da-luu" className="footer-link">
                <span>Bộ sưu tập cá nhân</span>
                <ArrowUpRight size={14} className="link-arrow" />
              </Link>
            </nav>
          </div>

          {/* Col 3: Editorial Dispatch / Newsletter */}
          <div className="footer-newsletter-col">
            <h4 className="footer-heading">Bản tin hành trình</h4>
            <p className="footer-newsletter-sub">
              Nhận gợi ý điểm đến ẩn danh và lịch trình theo mùa mỗi sáng thứ Bảy.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <Heart size={18} weight="fill" className="text-accent" />
                <span>Cảm ơn bạn! Bản tin đầu tiên sẽ gửi tới sớm nhất.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-subscribe-form">
                <div className="subscribe-input-shell">
                  <EnvelopeSimple size={18} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Địa chỉ email nhận bản tin"
                  />
                  <button type="submit" className="subscribe-btn" aria-label="Đăng ký nhận tin">
                    <PaperPlaneTilt size={16} weight="fill" />
                  </button>
                </div>
              </form>
            )}
            <div className="footer-micro-stats">
              <span>✦ Tuyển chọn độc quyền</span>
              <span>✦ Không spam</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            © {new Date().getFullYear()} Đi Đây Sanctuary. Phát triển với tình yêu dành cho cảnh quan & văn hóa Việt Nam.
          </p>
          <div className="footer-legal-links">
            <span className="footer-pill">Vietnam 3D Tourism</span>
            <span className="footer-pill">Aesthetic Travel Engine</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
