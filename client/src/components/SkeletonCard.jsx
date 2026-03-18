export default function SkeletonCard() {
    return (
      <div className="skeleton">
        <div className="skeleton-img" />
        <div className="skeleton-body">
          <div className="skeleton-line short" />
          <div className="skeleton-line medium" style={{ height: 18, marginBottom: 12 }} />
          <div className="skeleton-line short" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
            <div className="skeleton-line" style={{ width: '35%', height: 22 }} />
            <div className="skeleton-line" style={{ width: '28%', height: 34, borderRadius: 20 }} />
          </div>
        </div>
      </div>
    );
  }