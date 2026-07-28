const VARIANTS = {
  primary: 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm hover:shadow',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
  danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700',
  ghost: 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
};

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
