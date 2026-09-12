import { ArrowLeft, Compass } from '@phosphor-icons/react'
import { Link } from 'react-router'

export const NotFoundPage: React.FC = () => (
  <main className="not-found-page page-shell">
    <div className="not-found-card double-bezel-card">
      <div className="card-bezel-outer">
        <div className="card-bezel-inner not-found-inner">
          <div className="not-found-compass-circle">
            <Compass size={48} weight="duotone" className="lost-compass-spin" />
          </div>
          <span className="not-found-code">404</span>
          <h1>Con đường này chưa nằm trên hải trình.</h1>
          <p>Tọa độ bạn tìm kiếm dường như đã bị sóng biển cuốn trôi hoặc chưa từng tồn tại.</p>
          <Link className="button button-primary group" to="/">
            <ArrowLeft size={16} weight="bold" />
            <span>Trở về bờ bến an toàn</span>
          </Link>
        </div>
      </div>
    </div>
  </main>
)

export default NotFoundPage
