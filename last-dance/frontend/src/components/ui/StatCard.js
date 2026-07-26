const COLORS = {
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  green: 'bg-green-50 text-green-600',
  blue: 'bg-blue-50 text-blue-600',
};

export default function StatCard({ label, value, icon, color = 'orange' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0 ${COLORS[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );
}
