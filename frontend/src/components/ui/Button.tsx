'use client';
import * as React from 'react';
import Link from 'next/link';

function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  icon,
}: React.PropsWithChildren<{
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}>) {
  const base =
    'rounded-xl font-semibold px-6 py-4 transition-all flex items-center justify-center gap-2';
  const map: Record<string, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:scale-[1.02]',
    outline: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'text-blue-700 hover:underline',
  };
  const content = (
    <span className={`${base} ${map[variant]} ${className}`}>
      {icon}
      {children}
    </span>
  );
  return href ? (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={`${base} ${map[variant]} ${className}`}>
      {icon}
      {children}
    </button>
  );
}
export default Button;
