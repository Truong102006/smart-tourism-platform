import { Compass } from '@phosphor-icons/react'
import { Link } from 'react-router'

export const SiteFooter: React.FC = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div>
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark">
            <Compass size={22} weight="fill" aria-hidden="true" />
          </span>
          <span>Đi Đây</span>
        </Link>
        <p>Gợi ý vừa gu, hành trình vừa sức.</p>
      </div>
      <nav className="footer-links" aria-label="Liên kết cuối trang">
        <Link to="/kham-pha">Khám phá</Link>
        <Link to="/lich-trinh">Lịch trình</Link>
        <Link to="/da-luu">Đã lưu</Link>
      </nav>
      <p className="footer-note">Bản giao diện mẫu dùng dữ liệu minh họa.</p>
    </div>
  </footer>
)
