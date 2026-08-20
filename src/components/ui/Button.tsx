import clsx from 'clsx';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-emerald text-white hover:bg-green shadow-sm hover:shadow-md',
  secondary: 'bg-white text-navy border border-line hover:border-emerald hover:text-emerald',
  ghost: 'text-navy hover:bg-green-light',
  danger: 'bg-danger text-white hover:brightness-110',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-base',
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: Common & ComponentProps<'button'>) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...rest} />;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  ...rest
}: Common & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)} {...rest} />
  );
}
