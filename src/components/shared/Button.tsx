import React from 'react';

export type ButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost' | 'link' | 'linkDanger';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeCls = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500',
    danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-500',
    outline:
      'border border-zinc-300 text-slate-900 hover:bg-slate-50 bg-white',
    ghost: 'text-slate-700 hover:bg-slate-50',
    link: 'p-0 h-auto text-emerald-700 hover:underline bg-transparent',
    linkDanger: 'p-0 h-auto text-rose-600 hover:underline bg-transparent',
  };

  const widthCls = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  return (
    <button
      className={[base, sizeCls, variants[variant], widthCls, className || '']
        .join(' ')
        .trim()}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      )}
      {children}
    </button>
  );
}
