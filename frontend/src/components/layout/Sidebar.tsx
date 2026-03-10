interface SidebarProps {
  children?: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-1/5 min-w-[250px] h-full bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">맛집 탐색기</h1>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {children}
      </nav>
    </aside>
  );
}

export default Sidebar;
