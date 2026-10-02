import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Code, Cpu, ExternalLink, Sparkles } from 'lucide-react';

export const McpTab: React.FC = () => {
  const [manifest, setManifest] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mcp/manifest')
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch((err) => console.error(err));
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const claudeCodeConfig = JSON.stringify(
    {
      mcpServers: {
        'agent-reach': {
          command: 'agent-reach',
          args: ['mcp'],
        },
      },
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcpServers: {
        'agent-reach': {
          command: 'agent-reach',
          args: ['mcp'],
          env: {
            PATH: '/usr/local/bin:/usr/bin:$PATH',
          },
        },
      },
    },
    null,
    2
  );

  const agentSkillPrompt = `You have Agent Reach installed. Use its channels to search and inspect the internet:
- Web: Use the web reader to get clean markdown: curl -s "https://r.jina.ai/<URL>"
- GitHub: Search repos or inspect issues: gh search repos "<query>" or gh issue list
- Reddit: Read discussions directly: curl -s "https://www.reddit.com/r/<subreddit>/hot.json"
- V2EX: Check developer hot topics: curl -s "https://www.v2ex.com/api/topics/hot.json"
- Search: Run neural search via Exa or DuckDuckGo fallback
Always inspect channels using "agent-reach doctor" before multi-platform deep dives.`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Intro */}
      <div className="rounded-xl border border-indigo-900/40 bg-slate-900/80 p-5 space-y-2">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Cpu className="w-5 h-5" />
          <h2 className="text-base font-semibold text-white">Model Context Protocol (MCP) & Agent Skills Hub</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Agent Reach natively speaks the MCP standard, enabling Claude Code, Cursor, OpenClaw, and Windsurf to call web reading, scraping, and search tools seamlessly.
        </p>
      </div>

      {/* Configurations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Claude Code Config */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base">🤖</span>
                <h3 className="text-sm font-semibold text-white">Claude Code / Claude Desktop</h3>
              </div>
              <button
                onClick={() => copyToClipboard(claudeCodeConfig, 'claude')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer transition"
              >
                {copiedType === 'claude' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Add to <code className="font-mono text-indigo-300">claude_desktop_config.json</code>
            </p>
          </div>
          <pre className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800/80">
            {claudeCodeConfig}
          </pre>
        </div>

        {/* Cursor Config */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base">⚡</span>
                <h3 className="text-sm font-semibold text-white">Cursor IDE MCP</h3>
              </div>
              <button
                onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer transition"
              >
                {copiedType === 'cursor' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Add to <code className="font-mono text-indigo-300">.cursor/mcp.json</code> or Settings → MCP
            </p>
          </div>
          <pre className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800/80">
            {cursorConfig}
          </pre>
        </div>
      </div>

      {/* System Prompt / Skill Directive for LLMs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Agent System Prompt Directive</h3>
          </div>
          <button
            onClick={() => copyToClipboard(agentSkillPrompt, 'prompt')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer transition"
          >
            {copiedType === 'prompt' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Paste this directive into your agent's system prompt or custom instructions (OpenClaw, Claude, Cursor Rules):
        </p>
        <pre className="p-3.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 whitespace-pre-wrap border border-slate-800 leading-relaxed">
          {agentSkillPrompt}
        </pre>
      </div>

      {/* MCP Tools Catalog */}
      {manifest && manifest.tools && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Registered MCP Tools</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {manifest.tools.map((t: any) => (
              <div
                key={t.name}
                className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-300">{t.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    MCP Tool
                  </span>
                </div>
                <p className="text-xs text-slate-300">{t.description}</p>
                <div className="pt-1 text-[11px] text-slate-500 font-mono">
                  Parameters: {Object.keys(t.parameters?.properties || {}).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
