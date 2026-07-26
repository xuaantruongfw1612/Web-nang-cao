const COLORS = {
  gray: 'bg-gray-100 text-gray-500',
  yellow: 'bg-yellow-100 text-yellow-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
};

export default function Badge({ color = 'gray', children }) {
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase inline-block ${COLORS[color] || COLORS.gray}`}
    >
      {children}
    </span>
  );
}
