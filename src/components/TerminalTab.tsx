import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, HelpCircle } from 'lucide-react';

export const TerminalTab: React.FC = () => {
  const [command, setCommand] = useState<string>('agent-reach doctor');
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'agent-reach doctor',
      output: [
        '🩺 Agent Reach Doctor v1.5.0',
        '==================================================================',
        'CHANNEL               STATUS        PRIMARY BACKEND       NOTE',
        '------------------------------------------------------------------',
        'web                   [ONLINE]      jina-ai               Direct reader & markdown fallback',
        'github                [ONLINE]      api.github.com        Public REST API active',
        'reddit                [ONLINE]      json-gateway          Public JSON reader active',
        'v2ex                  [ONLINE]      v2ex-api              Hot topics endpoint healthy',
        'rss                   [ONLINE]      feedparser            Zero config, ready',
        'youtube               [ONLINE]      yt-dlp                Transcript extractor ready',
        'bilibili              [ONLINE]      bili-cli              Video search without auth',
        'xueqiu                [ONLINE]      xueqiu-api            Stock quotes reader ready',
        '------------------------------------------------------------------',
        'Summary: 8 zero-config channels online and ready for agent queries.',
      ].join('\n'),
    },
  ]);
  const [executing, setExecuting] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRun = async (cmdToRun?: string) => {
    const cmd = (cmdToRun || command).trim();
    if (!cmd || executing) return;

    setExecuting(true);
    try {
      const res = await fetch('/api/cli/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      setHistory((prev) => [...prev, { cmd, output: data.output || 'Command executed successfully.' }]);
      if (!cmdToRun) setCommand('');
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        { cmd, output: `Execution error: ${err.message || 'Failed to contact CLI server'}` },
      ]);
    } finally {
      setExecuting(false);
    }
  };

  const quickCommands = [
    'agent-reach doctor',
    'agent-reach install --env=auto',
    'agent-reach check-update',
    'agent-reach configure twitter-cookies',
    'agent-reach configure proxy',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Intro */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Agent Reach Terminal Console</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute native Agent Reach CLI commands interactively.
          </p>
        </div>
        <button
          onClick={() => setHistory([])}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Quick Command Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500 mr-1 flex items-center">
          <HelpCircle className="w-3 h-3 mr-1" /> Quick:
        </span>
        {quickCommands.map((qc) => (
          <button
            key={qc}
            onClick={() => handleRun(qc)}
            disabled={executing}
            className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 text-xs font-mono transition cursor-pointer disabled:opacity-50"
          >
            {qc}
          </button>
        ))}
      </div>

      {/* Terminal Window */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            <span className="text-[11px] text-slate-400 pl-2">bash — agent-reach-cli</span>
          </div>
          <span className="text-[10px] text-slate-500">Agent Reach v1.5.0</span>
        </div>

        {/* Terminal Screen */}
        <div className="p-4 h-[420px] overflow-y-auto space-y-4 text-slate-200">
          {history.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center space-x-2 text-indigo-400">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="font-semibold">{item.cmd}</span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap pl-4 leading-relaxed border-l-2 border-slate-800/80 py-0.5">
                {item.output}
              </pre>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRun();
          }}
          className="flex items-center border-t border-slate-800 bg-slate-900/80 px-4 py-2.5"
        >
          <span className="text-emerald-400 font-bold mr-2.5">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type command (e.g. agent-reach doctor)..."
            disabled={executing}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
          />
          <button
            type="submit"
            disabled={executing || !command.trim()}
            className="ml-2 flex items-center space-x-1 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-sans transition cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Run</span>
          </button>
        </form>
      </div>
    </div>
  );
};
