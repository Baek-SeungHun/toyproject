interface SidebarProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

function Sidebar({ header, children }: SidebarProps) {
  return (
    <aside
      className="w-[320px] min-w-[280px] h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* 상단 로고 + 유저 영역 */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: '1px solid var(--color-divider)' }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          맛집 탐색기
        </h1>
        {header && <div className="mt-3">{header}</div>}
      </div>

      {/* 콘텐츠 영역 */}
      <nav className="flex-1 px-5 py-5 overflow-y-auto">
        {children}
      </nav>
    </aside>
  );
}

export default Sidebar;
