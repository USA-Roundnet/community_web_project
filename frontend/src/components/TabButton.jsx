const TabButton = ({ active, children, onClick }) => {
  return (
    <button
      type="button"
      className={`op-btn px-4 py-2 border transition-colors ${
        active
          ? "bg-[var(--op-primary)] text-white border-[var(--op-primary)]"
          : "bg-white text-[var(--op-secondary)] border-[var(--op-border)] hover:bg-[var(--op-surface-muted)]"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TabButton; 
