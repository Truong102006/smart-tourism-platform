import {
  Compass,
  Heart,
  List,
  Moon,
  Path as RouteIcon,
  Sparkle,
  Sun,
  X,
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useTrip } from '@/features/trip/context/trip-store'

const navItems = [
  { to: '/kham-pha', label: 'Khám phá', icon: Compass },
  { to: '/lich-trinh', label: 'Lịch trình', icon: RouteIcon },
  { to: '/da-luu', label: 'Đã lưu', icon: Heart },
]

export const SiteHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const { favoriteIds, itinerary } = useTrip()
  const location = useLocation()

  // Track scroll position for dynamic glass condensation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change during render
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMenuOpen(false)
  }

  const toggleTheme = (): void => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('di-day-theme', nextTheme)
    setTheme(nextTheme)
  }

  return (
    <header className={`site-header-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header floating-island">
        <div className="header-inner">
          {/* Brand with subtle animated compass mark */}
          <Link className="brand" to="/" aria-label="Đi Đây, về trang chủ">
            <span className="brand-mark-glow">
              <Compass size={22} weight="fill" className="compass-icon" aria-hidden="true" />
            </span>
            <div className="brand-text-group">
              <span className="brand-title">Đi Đây</span>
              <span className="brand-tagline">VIETNAM SANCTUARY</span>
            </div>
          </Link>

          {/* Center floating nav links */}
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {navItems.map((item) => {
              const Icon = item.icon
              const count =
                item.to === '/da-luu'
                  ? favoriteIds.length
                  : item.to === '/lich-trinh'
                  ? itinerary.length
                  : 0

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={16} weight="duotone" className="nav-item-icon" />
                  <span>{item.label}</span>
                  {count > 0 ? <span className="nav-count-badge">{count}</span> : null}
                </NavLink>
              )
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="header-actions">
            <button
              className="icon-button theme-toggle-btn"
              type="button"
              aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={18} weight="bold" /> : <Sun size={18} weight="bold" />}
            </button>

            <Link className="button button-primary desktop-cta group" to="/kham-pha">
              <span>Tìm điểm đến</span>
              <div className="btn-icon-circle">
                <Sparkle size={13} weight="fill" />
              </div>
            </Link>

            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Glass Overlay Menu */}
        {menuOpen ? (
          <div className="mobile-nav-backdrop" onClick={() => setMenuOpen(false)}>
            <nav
              className="mobile-nav-card reveal-in"
              aria-label="Điều hướng di động"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-nav-header">
                <span className="eyebrow">Menu điều hướng</span>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Đóng"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="mobile-nav-links">
                {navItems.map((item, idx) => {
                  const Icon = item.icon
                  const count =
                    item.to === '/da-luu'
                      ? favoriteIds.length
                      : item.to === '/lich-trinh'
                      ? itinerary.length
                      : 0

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `mobile-nav-item ${isActive ? 'active' : ''}`
                      }
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <div className="mobile-nav-item-left">
                        <span className="mobile-icon-box">
                          <Icon size={20} weight="duotone" />
                        </span>
                        <span className="mobile-nav-text">{item.label}</span>
                      </div>
                      {count > 0 ? (
                        <span className="nav-count-badge">{count}</span>
                      ) : null}
                    </NavLink>
                  )
                })}
              </div>

              <div className="mobile-nav-footer">
                <Link
                  to="/kham-pha"
                  className="button button-primary mobile-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Khám phá ngay</span>
                  <div className="btn-icon-circle">
                    <Sparkle size={14} weight="fill" />
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  )
}
