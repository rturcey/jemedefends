'use client';
import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  'data-umami-event'?: string;
}

interface ButtonProps
  extends BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  href?: never;
}

interface LinkButtonProps
  extends BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'size'> {
  href: string;
  onClick?: never;
  type?: never;
}

type CombinedButtonProps = ButtonProps | LinkButtonProps;

const MOBILE_TOUCH_CLASS = 'min-h-[44px] min-w-[44px] touch-manipulation';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-600',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg border-gray-600',
  outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400',
  ghost: 'text-blue-700 hover:bg-blue-50 hover:text-blue-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg border-red-600',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  loading = false,
  disabled = false,
  ...props
}: CombinedButtonProps) {
  const baseClasses = `
    ${MOBILE_TOUCH_CLASS}
    inline-flex items-center justify-center gap-2 
    font-semibold rounded-xl border
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    active:scale-95 active:transition-transform active:duration-75
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  const content = (
    <>
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses} {...(props as any)}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.1 }}
      {...(props as any)}
    >
      {content}
    </motion.button>
  );
}
