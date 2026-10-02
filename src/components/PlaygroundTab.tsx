import React, { useState } from 'react';
import { Send, Copy, Check, Loader2, Sparkles, Globe, Github, MessageSquare, Rss, Search, Video } from 'lucide-react';

interface PlaygroundTabProps {
  initialChannel?: string;
}

export const PlaygroundTab: React.FC<PlaygroundTabProps> = ({ initialChannel = 'web' }) => {
  const [selectedChannel, setSelectedChannel] = useState<string>(initialChannel);
  const [inputUrl, setInputUrl] = useState<string>('https://news.ycombinator.com');
  const [inputQuery, setInputQuery] = useState<string>('torvalds/linux');
  const [inputSubreddit, setInputSubreddit] = useState<string>('technology');
  const [inputFeedUrl, setInputFeedUrl] = useState<string>('https://news.ycombinator.com/rss');
  const [inputSearch, setInputSearch] = useState<string>('LLM agent frameworks comparison 2026');

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const channels = [
    { id: 'web', name: 'Web Reader (Jina / Direct)', icon: Globe },
    { id: 'github', name: 'GitHub Repo / Search', icon: Github },
    { id: 'reddit', name: 'Reddit Discussions', icon: MessageSquare },
    { id: 'rss', name: 'RSS / Atom Reader', icon: Rss },
    { id: 'v2ex', name: 'V2EX Hot Topics', icon: Sparkles },
    { id: 'exa_search', name: 'Exa Semantic Search', icon: Search },
    { id: 'youtube', name: 'YouTube Transcript', icon: Video },
  ];

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const start = Date.now();

    try {
      let body: any = {};
      if (selectedChannel === 'web') {
        body = { url: inputUrl };
      } else if (selectedChannel === 'github') {
        if (inputQuery.includes('/')) {
          body = { repo: inputQuery };
        } else {
          body = { query: inputQuery };
        }
      } else if (selectedChannel === 'reddit') {
        body = { subreddit: inputSubreddit };
      } else if (selectedChannel === 'rss') {
        body = { feedUrl: inputFeedUrl };
      } else if (selectedChannel === 'exa_search') {
        body = { query: inputSearch };
      } else if (selectedChannel === 'youtube') {
        body = { videoUrl: inputUrl };
      }

      const res = await fetch(`/api/reach/${selectedChannel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setExecutionTime(Date.now() - start);

      if (!res.ok) {
        setError(data.error || `HTTP error ${res.status}`);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network request failed');
      setExecutionTime(Date.now() - start);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-base font-semibold text-white flex items-center space-x-2">
          <span>⚡</span>
          <span>Interactive Channel Playground</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Test reading content through Agent Reach's unified backend proxy. Agents consume this clean parsed data directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Channel Selector & Inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
              Select Channel
            </label>
            <div className="space-y-1">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const isSelected = selectedChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChannel(ch.id);
                      setResult(null);
                      setError(null);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{ch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Input based on Selected Channel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
              Channel Parameters
            </label>

            {selectedChannel === 'web' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400">Target Web URL</label>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['https://news.ycombinator.com', 'https://github.com/trending', 'https://lobste.rs'].map((url) => (
                    <button
                      key={url}
                      onClick={() => setInputUrl(url)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {new URL(url).hostname}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChannel === 'github' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400">Owner/Repo or Search Term</label>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="facebook/react or llm agent"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['torvalds/linux', 'facebook/react', 'golang/go', 'agent-reach'].map((repo) => (
                    <button
                      key={repo}
                      onClick={() => setInputQuery(repo)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {repo}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChannel === 'reddit' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400">Subreddit (without r/)</label>
                <input
                  type="text"
                  value={inputSubreddit}
                  onChange={(e) => setInputSubreddit(e.target.value)}
                  placeholder="technology"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['technology', 'programming', 'localllama', 'artificial'].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setInputSubreddit(sub)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-300 cursor-pointer"
                    >
                      r/{sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChannel === 'rss' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400">RSS Feed URL</label>
                <input
                  type="url"
                  value={inputFeedUrl}
                  onChange={(e) => setInputFeedUrl(e.target.value)}
                  placeholder="https://example.com/rss.xml"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {[
                    'https://news.ycombinator.com/rss',
                    'https://github.blog/feed/',
                    'https://feeds.feedburner.com/TechCrunch/',
                  ].map((feed) => (
                    <button
                      key={feed}
                      onClick={() => setInputFeedUrl(feed)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-300 cursor-pointer truncate max-w-[180px]"
                    >
                      {feed.replace('https://', '').split('/')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChannel === 'exa_search' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400">Search Query</label>
                <input
                  type="text"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  placeholder="Autonomous AI agent memory patterns"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            )}

            {selectedChannel === 'v2ex' && (
              <p className="text-xs text-slate-400 italic">
                Pulls currently trending topics directly from the V2EX public hot JSON endpoint.
              </p>
            )}

            {selectedChannel === 'youtube' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400">YouTube Video URL</label>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Route...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Reach Query</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Output Viewer */}
        <div className="lg:col-span-8 flex flex-col h-[520px] rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
          {/* Output Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-300">Response Viewer</span>
              {executionTime !== null && (
                <span className="text-[11px] font-mono text-emerald-400">
                  ⚡ {executionTime} ms
                </span>
              )}
            </div>

            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              >
                {copied ? (
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
            )}
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <p className="text-xs">Fetching & parsing content from {selectedChannel}...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-rose-300 space-y-2">
                <div className="font-semibold flex items-center space-x-1.5">
                  <span>Execution Error:</span>
                </div>
                <p className="text-xs font-mono">{error}</p>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Select a channel and press "Execute Reach Query" to inspect output.</p>
              </div>
            )}

            {!loading && result && (
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
