import React from 'react';
import { Eye, ShieldCheck, Activity, Terminal, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: { total: number; healthy: number; warning: number; needs_config: number };
  refreshDoctor: () => void;
  isDoctorLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  refreshDoctor,
  isDoctorLoading,
}) => {
  const tabs = [
    { id: 'doctor', label: 'Doctor Diagnostics', icon: Activity },
    { id: 'playground', label: 'Live Channel Tester', icon: Sparkles },
    { id: 'config', label: 'Credentials & Config', icon: ShieldCheck },
    { id: 'mcp', label: 'MCP & Agent Skills', icon: Eye },
    { id: 'terminal', label: 'CLI Simulator', icon: Terminal },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-xl font-bold">
              👁️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Agent Reach</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.5.0
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  16 Platforms
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Give your AI Agent eyes to see the entire internet
              </p>
            </div>
          </div>

          {/* Quick status summary and doctor button */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{stats.healthy} Online</span>
              </span>
              {stats.needs_config > 0 && (
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  <span>{stats.needs_config} Needs Key</span>
                </span>
              )}
            </div>

            <button
              onClick={refreshDoctor}
              disabled={isDoctorLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition disabled:opacity-50 cursor-pointer"
              title="Run Doctor Diagnostic"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDoctorLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Run Doctor</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-indigo-300 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
