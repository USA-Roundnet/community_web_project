const TournamentPageShell = ({
  kicker,
  title,
  subtitle,
  children,
  actions,
  maxWidth = "1200px",
}) => {
  return (
    <div className="op-page min-h-[89vh] w-full">
      <div className="op-shell py-4 sm:py-6" style={{ maxWidth }}>
        <header className="op-card p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              {kicker ? <span className="op-kicker">{kicker}</span> : null}
              <h1 className="op-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--op-primary-strong)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="op-ui text-sm sm:text-base text-[var(--op-text-muted)] max-w-3xl">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};

export default TournamentPageShell;
