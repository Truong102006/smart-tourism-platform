import { Compass } from '@phosphor-icons/react'

export const PageLoader: React.FC = () => (
  <main className="page-shell page-loader-shell" aria-busy="true" aria-label="Đang chuẩn bị hành trình">
    <div className="loader-center-brand">
      <div className="loader-compass-glow">
        <Compass size={36} weight="fill" className="loader-compass-spin" />
      </div>
      <p className="loader-text">Đang tải không gian hành trình...</p>
    </div>
    <div className="skeleton-grid">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton skeleton-card" key={index} />
      ))}
    </div>
  </main>
)
