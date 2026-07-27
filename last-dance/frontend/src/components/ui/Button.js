const VARIANTS = {
  primary: 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600',
  ghost: 'text-gray-500 hover:text-gray-700',
};

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
