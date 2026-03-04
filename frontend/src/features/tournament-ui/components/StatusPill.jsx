const STATUS_STYLES = {
  upcoming: "bg-blue-100 text-blue-900 border-blue-200",
  in_progress: "bg-emerald-100 text-emerald-900 border-emerald-200",
  completed: "bg-slate-200 text-slate-800 border-slate-300",
  warning: "bg-amber-100 text-amber-900 border-amber-200",
  danger: "bg-red-100 text-red-900 border-red-200",
  success: "bg-green-100 text-green-900 border-green-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
};

const StatusPill = ({ label, tone = "neutral" }) => {
  const className = STATUS_STYLES[tone] || STATUS_STYLES.neutral;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
};

export default StatusPill;
