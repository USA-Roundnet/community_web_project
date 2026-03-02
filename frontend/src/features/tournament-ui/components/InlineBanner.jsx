import StatusPill from "./StatusPill";

const toneToClass = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

const InlineBanner = ({ tone = "info", title, message, children }) => {
  return (
    <div className={`rounded-xl border px-3 py-2 ${toneToClass[tone] || toneToClass.info}`}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill label={tone.toUpperCase()} tone={tone === "error" ? "danger" : tone} />
        {title ? <p className="font-semibold text-sm">{title}</p> : null}
      </div>
      {message ? <p className="mt-1 text-sm">{message}</p> : null}
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
};

export default InlineBanner;
