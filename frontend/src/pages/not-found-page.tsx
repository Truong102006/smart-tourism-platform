import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router'

export const NotFoundPage: React.FC = () => (
  <main className="not-found-page page-shell">
    <span>404</span>
    <h1>Con đường này chưa có trên bản đồ.</h1>
    <p>Quay lại trang chủ để tìm một hành trình khác.</p>
    <Link className="button button-primary" to="/">
      <ArrowLeft size={18} /> Về trang chủ
    </Link>
  </main>
)

export default NotFoundPage
