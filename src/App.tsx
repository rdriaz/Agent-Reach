import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DoctorTab, ChannelItem } from './components/DoctorTab';
import { PlaygroundTab } from './components/PlaygroundTab';
import { ConfigTab } from './components/ConfigTab';
import { McpTab } from './components/McpTab';
import { TerminalTab } from './components/TerminalTab';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('doctor');
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [stats, setStats] = useState({ total: 16, healthy: 8, warning: 0, needs_config: 4 });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isDoctorLoading, setIsDoctorLoading] = useState<boolean>(true);
  const [playgroundInitialChannel, setPlaygroundInitialChannel] = useState<string>('web');

  const fetchDoctor = async () => {
    setIsDoctorLoading(true);
    try {
      const res = await fetch('/api/doctor');
      const data = await res.json();
      if (data.channels) {
        setChannels(data.channels);
      }
      if (data.stats) {
        setStats(data.stats);
      }
      if (data.timestamp) {
        setLastUpdated(data.timestamp);
      }
    } catch (err) {
      console.error('Failed to fetch doctor health check', err);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const handleSelectChannelForPlayground = (channelId: string) => {
    setPlaygroundInitialChannel(channelId);
    setActiveTab('playground');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        refreshDoctor={fetchDoctor}
        isDoctorLoading={isDoctorLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'doctor' && (
          <DoctorTab
            channels={channels}
            onSelectChannelForPlayground={handleSelectChannelForPlayground}
            onGoToConfig={() => setActiveTab('config')}
            isLoading={isDoctorLoading}
            lastUpdated={lastUpdated}
          />
        )}

        {activeTab === 'playground' && (
          <PlaygroundTab initialChannel={playgroundInitialChannel} />
        )}

        {activeTab === 'config' && (
          <ConfigTab onConfigSaved={fetchDoctor} />
        )}

        {activeTab === 'mcp' && (
          <McpTab />
        )}

        {activeTab === 'terminal' && (
          <TerminalTab />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        Agent Reach v1.5.0 • Multi-Platform Internet Reader & Agent Search Gateway
      </footer>
    </div>
  );
}

export default App;
