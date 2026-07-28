export default function Card({ className = '', children, ...props }) {
  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md transition-shadow duration-300 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}
