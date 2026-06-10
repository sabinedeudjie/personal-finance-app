import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'title' | 'card' | 'chart' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  if (variant === 'circle' && width) style.minWidth = style.width;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant] ?? ''} ${className}`}
      style={style}
      role="status"
      aria-label="Chargement..."
    />
  );
}

/**
 * Affiche le squelette de chargement du tableau de bord complet.
 */
export function DashboardSkeleton() {
  return (
    <div style={{ padding: '0' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '2rem' }}>
        <Skeleton variant="title" width="220px" />
        <Skeleton variant="text" width="160px" />
      </div>

      {/* Stat cards */}
      <div className={styles.dashboardGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonCardTop}>
              <Skeleton variant="circle" width={40} height={40} />
              <Skeleton variant="text" width="60%" />
            </div>
            <Skeleton variant="title" width="50%" />
            <Skeleton variant="text" width="40%" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.skeletonCard}>
          <Skeleton variant="title" width="180px" />
          <Skeleton variant="text" width="140px" />
          <Skeleton variant="chart" />
        </div>
        <div className={styles.skeletonCard}>
          <Skeleton variant="title" width="120px" />
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="chart" height={220} />
        </div>
      </div>
    </div>
  );
}
