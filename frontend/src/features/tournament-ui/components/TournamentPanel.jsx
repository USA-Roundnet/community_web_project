const TournamentPanel = ({ title, subtitle, children, actions, className = "" }) => {
  return (
    <section className={`op-card p-4 sm:p-5 ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="op-display text-lg sm:text-xl font-semibold text-[var(--op-primary-strong)]">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="op-ui mt-1 text-sm text-[var(--op-text-muted)]">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
};

export default TournamentPanel;
