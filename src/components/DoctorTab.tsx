import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Zap,
} from 'lucide-react';

export interface ChannelItem {
  id: string;
  name: string;
  category: 'search' | 'social' | 'career' | 'dev' | 'web' | 'video' | 'finance';
  description: string;
  primaryBackend: string;
  fallbackBackend: string;
  authRequired: boolean;
  status: 'healthy' | 'warning' | 'needs_config' | 'offline';
  latency: number;
  message: string;
  lastChecked: string;
  docPath: string;
}

interface DoctorTabProps {
  channels: ChannelItem[];
  onSelectChannelForPlayground: (channelId: string) => void;
  onGoToConfig: () => void;
  isLoading: boolean;
  lastUpdated: string;
}

export const DoctorTab: React.FC<DoctorTabProps> = ({
  channels,
  onSelectChannelForPlayground,
  onGoToConfig,
  isLoading,
  lastUpdated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Channels' },
    { id: 'web', label: 'Web & RSS' },
    { id: 'dev', label: 'Dev & Code' },
    { id: 'social', label: 'Social & Forums' },
    { id: 'search', label: 'Search' },
    { id: 'career', label: 'Jobs & Career' },
    { id: 'video', label: 'Video & Media' },
    { id: 'finance', label: 'Finance' },
  ];

  const filtered = channels.filter((ch) => {
    if (selectedCategory !== 'all' && ch.category !== selectedCategory) return false;
    if (statusFilter !== 'all' && ch.status !== statusFilter) return false;
    if (
      searchQuery &&
      !ch.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ch.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ch.primaryBackend.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: ChannelItem['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Operational</span>
          </span>
        );
      case 'needs_config':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <KeyRound className="w-3 h-3" />
            <span>Needs Auth</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>Degraded</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            <span>Offline</span>
          </span>
        );
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'web':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'dev':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'social':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'search':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'career':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'video':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'finance':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Philosophy */}
      <div className="rounded-xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🩺</span>
              <h2 className="text-lg font-semibold text-white">Channel Health & Routing Matrix</h2>
            </div>
            <p className="text-sm text-slate-300">
              Agent Reach routes requests through primary and fallback backends. 6 channels work with zero configuration; others use local cookies or API tokens.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
            <span>Last checked: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Just now'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Status filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="healthy">Operational</option>
              <option value="needs_config">Needs Auth</option>
              <option value="warning">Degraded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-xl border border-slate-800 bg-slate-900/50 p-4 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-400">
          <p className="text-sm">No channels matched your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((channel) => (
            <div
              key={channel.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/70 hover:border-slate-700 transition flex flex-col justify-between p-4 shadow-sm group"
            >
              <div className="space-y-3">
                {/* Header row: title, category badge, status badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                      {channel.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider ${getCategoryColor(
                        channel.category
                      )}`}
                    >
                      {channel.category}
                    </span>
                  </div>
                  <div>{getStatusBadge(channel.status)}</div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {channel.description}
                </p>

                {/* Routing & backend info */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Primary:</span>
                    <span className="font-mono text-slate-300 truncate max-w-[160px]">
                      {channel.primaryBackend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Fallback:</span>
                    <span className="font-mono text-slate-400 truncate max-w-[160px]">
                      {channel.fallbackBackend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Latency:</span>
                    <span className="font-mono text-emerald-400">{channel.latency} ms</span>
                  </div>
                </div>

                {/* Diagnostic message */}
                <div className="rounded bg-slate-950/60 p-2 text-[11px] text-slate-300 border border-slate-800/60">
                  <span className="text-slate-500 font-semibold mr-1">Diag:</span>
                  {channel.message}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectChannelForPlayground(channel.id)}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-medium transition cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Test Channel</span>
                </button>

                {channel.authRequired && channel.status === 'needs_config' && (
                  <button
                    onClick={onGoToConfig}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-medium transition cursor-pointer"
                    title="Configure Credentials"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Config</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
