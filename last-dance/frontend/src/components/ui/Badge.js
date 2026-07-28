const COLORS = {
  slate: 'bg-slate-50 text-slate-600 border border-slate-200',
  yellow: 'bg-amber-50 text-amber-600 border border-amber-200/60',
  green: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
  red: 'bg-rose-50 text-rose-600 border border-rose-200/60',
  blue: 'bg-blue-50 text-blue-600 border border-blue-200/60',
  purple: 'bg-purple-50 text-purple-600 border border-purple-200/60',
  pink: 'bg-pink-50 text-pink-600 border border-pink-200/60',
};

// Map các màu cũ của bạn sang dải màu mới
const MAP_COLORS = {
  gray: 'slate',
  yellow: 'yellow',
  green: 'green',
  red: 'red',
  blue: 'blue',
  purple: 'purple',
  pink: 'pink'
};

export default function Badge({ color = 'gray', children }) {
  const resolvedColor = MAP_COLORS[color] || 'slate';
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase inline-block ${COLORS[resolvedColor]}`}
    >
      {children}
    </span>
  );
}
