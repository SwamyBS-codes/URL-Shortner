function SkeletonLoader({ rows = 3 }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <span className="skeleton-block skeleton-block-wide" />
          <span className="skeleton-block" />
          <span className="skeleton-block skeleton-block-short" />
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader
