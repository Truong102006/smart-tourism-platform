import {
  Compass,
  Heart,
  List,
  Moon,
  Path as RouteIcon,
  Sun,
  X,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useTrip } from '@/features/trip/context/trip-store'

const navItems = [
  { to: '/kham-pha', label: 'Khám phá' },
  { to: '/lich-trinh', label: 'Lịch trình' },
  { to: '/da-luu', label: 'Đã lưu' },
]

export const SiteHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const { favoriteIds, itinerary } = useTrip()

  const toggleTheme = (): void => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('di-day-theme', nextTheme)
    setTheme(nextTheme)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Đi Đây, về trang chủ">
          <span className="brand-mark">
            <Compass size={23} weight="fill" aria-hidden="true" />
          </span>
          <span>Đi Đây</span>
        </Link>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
              {item.to === '/da-luu' && favoriteIds.length > 0 ? (
                <span className="nav-count">{favoriteIds.length}</span>
              ) : null}
              {item.to === '/lich-trinh' && itinerary.length > 0 ? (
                <span className="nav-count">{itinerary.length}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={theme === 'light' ? 'Bật giao diện tối' : 'Bật giao diện sáng'}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link className="button button-primary desktop-cta" to="/kham-pha">
            Tìm điểm đến
          </Link>
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="mobile-nav" aria-label="Điều hướng di động">
          <NavLink to="/kham-pha" onClick={() => setMenuOpen(false)}>
            <Compass size={20} /> Khám phá
          </NavLink>
          <NavLink to="/lich-trinh" onClick={() => setMenuOpen(false)}>
            <RouteIcon size={20} /> Lịch trình ({itinerary.length})
          </NavLink>
          <NavLink to="/da-luu" onClick={() => setMenuOpen(false)}>
            <Heart size={20} /> Đã lưu ({favoriteIds.length})
          </NavLink>
        </nav>
      ) : null}
    </header>
  )
}
