export const PageLoader: React.FC = () => (
  <main className="page-shell" aria-busy="true" aria-label="Đang tải nội dung">
    <div className="skeleton skeleton-title" />
    <div className="skeleton-grid">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton skeleton-card" key={index} />
      ))}
    </div>
  </main>
)
