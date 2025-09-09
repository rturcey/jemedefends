import type { ChildrenProps } from '@/components/utils';

function Container({ className = '', children }: ChildrenProps) {
  return <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>;
}

export default Container;
