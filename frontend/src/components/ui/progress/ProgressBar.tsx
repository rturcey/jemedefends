// src/components/ui/progress/ProgressBar.tsx
type Props = {
  value: number; // 0..100
  ariaLabel?: string;
  heightClass?: string; // ex: 'h-2'
  trackClass?: string; // ex: 'bg-gray-100'
  barClass?: string; // ex: 'bg-blue-600'
  animate?: boolean; // width transition
  className?: string;
};

export default function ProgressBar({
  value,
  ariaLabel = 'Progression',
  heightClass = 'h-1',
  trackClass = 'bg-gray-200',
  barClass = 'bg-blue-600',
  animate = true,
  className = '',
}: Props) {
  const clBar = [
    'h-full rounded',
    animate ? 'transition-[width] duration-300 ease-in-out' : '',
    barClass,
  ].join(' ');
  return (
    <div
      className={['w-full rounded', heightClass, trackClass, className].join(' ')}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.max(0, Math.min(100, value))}
    >
      <div className={clBar} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
