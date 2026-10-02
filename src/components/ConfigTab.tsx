import React, { useState, useEffect } from 'react';
import { Shield, Key, Check, Save, Lock, Info, ExternalLink } from 'lucide-react';

interface ConfigTabProps {
  onConfigSaved: () => void;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ onConfigSaved }) => {
  const [config, setConfig] = useState<Record<string, { value: string; isSet: boolean }>>({});
  const [formData, setFormData] = useState<Record<string, string>>({
    proxy: '',
    github_token: '',
    exa_api_key: '',
    openai_key: '',
    groq_key: '',
    twitter_cookies: '',
    xhs_cookies: '',
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Failed to load config', err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload: Record<string, string> = {};
      for (const [k, v] of Object.entries(formData)) {
        if (v && v.trim().length > 0) {
          payload[k] = v.trim();
        }
      }

      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSaveSuccess(true);
      setFormData({
        proxy: '',
        github_token: '',
        exa_api_key: '',
        openai_key: '',
        groq_key: '',
        twitter_cookies: '',
        xhs_cookies: '',
      });
      await fetchConfig();
      onConfigSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving config', err);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      key: 'github_token',
      label: 'GitHub Personal Access Token',
      description: 'Raises rate limit from 60 req/hr to 5,000 req/hr for code & repo searches.',
      placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
      link: 'https://github.com/settings/tokens',
    },
    {
      key: 'exa_api_key',
      label: 'Exa AI Search API Key',
      description: 'Used for neural/semantic web search via mcporter.',
      placeholder: 'exa_xxxxxxxxxxxxxxxxxxxx',
      link: 'https://exa.ai',
    },
    {
      key: 'groq_key',
      label: 'Groq API Key (Whisper Audio)',
      description: 'Powers ultra-fast podcast transcription for Xiaoyuzhou & video audio.',
      placeholder: 'gsk_xxxxxxxxxxxxxxxxxxxx',
      link: 'https://console.groq.com/keys',
    },
    {
      key: 'openai_key',
      label: 'OpenAI API Key (Optional)',
      description: 'Fallback audio transcription and agent analysis.',
      placeholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxx',
      link: 'https://platform.openai.com/api-keys',
    },
    {
      key: 'twitter_cookies',
      label: 'Twitter / X Cookies (auth_token & ct0)',
      description: 'Enables search and timeline access without paid enterprise tier.',
      placeholder: 'auth_token=...; ct0=...',
    },
    {
      key: 'xhs_cookies',
      label: 'Xiaohongshu Session Cookie',
      description: 'Allows reading notes and product reviews.',
      placeholder: 'web_session=...',
    },
    {
      key: 'proxy',
      label: 'HTTP/HTTPS Proxy',
      description: 'For restricted networks or routing specific channel scrapers.',
      placeholder: 'http://127.0.0.1:7890',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Shield className="w-5 h-5" />
          <h2 className="text-base font-semibold text-white">Credentials & Token Vault</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Agent Reach stores sensitive tokens locally for your agents. Values are securely masked. 
          Zero-config channels (Web, Reddit, GitHub public, V2EX, RSS) work without any keys.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field) => {
            const isConfigured = config[field.key]?.isSet;
            const maskedVal = config[field.key]?.value;

            return (
              <div
                key={field.key}
                className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-semibold text-slate-200">{field.label}</label>
                    {isConfigured ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check className="w-2.5 h-2.5" />
                        <span>Configured ({maskedVal})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                        <span>Not set</span>
                      </span>
                    )}
                  </div>

                  {field.link && (
                    <a
                      href={field.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center space-x-1 self-start sm:self-auto"
                    >
                      <span>Get key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">{field.description}</p>

                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={isConfigured ? `Leave blank to keep existing (${maskedVal})` : field.placeholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/95 shadow-xl backdrop-blur">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Updates are kept in-memory for security.</span>
          </div>

          <div className="flex items-center space-x-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
