import React from 'react';

export type ActiveTab = 'visualizer' | 'code-explanation' | 'dry-run' | 'viva';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  converged: boolean;
  totalIterations: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  converged,
  totalIterations,
}) => {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'visualizer', label: 'Solver & Visualizer' },
    { id: 'code-explanation', label: 'Understand the Code' },
    { id: 'dry-run', label: 'Textbook Dry Run' },
    { id: 'viva', label: 'Viva Preparation' },
  ];

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Application name & small subtitle */}
        <div>
          <h1 className="text-xl font-bold text-[#202124] tracking-tight">
            Steepest Descent Solver
          </h1>
          <p className="text-xs text-[#6B7280] font-normal">
            Interactive Optimization Learning Tool
          </p>
        </div>

        {/* Right: Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-[#2563EB] bg-blue-50 font-semibold'
                    : 'text-[#6B7280] hover:text-[#202124] hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
