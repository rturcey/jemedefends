// src/types/components.ts
export interface HeroProps {
  title: React.ReactNode;
  subtitle?: string;
  variant?: 'default' | 'minimal' | 'centered';
  actions?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  href?: never; // Exclusion mutuelle avec LinkButton
}

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  icon?: ButtonProps['icon'];
  onClick?: never; // Exclusion mutuelle avec Button
}
