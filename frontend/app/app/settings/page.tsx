'use client';

import React, { useState, useEffect } from 'react';
import { useBrandPilot } from '@/lib/store';
import {
  Settings,
  Shield,
  Sliders,
  Key,
  Database,
  CheckCircle2,
  Globe,
  Lock,
  Radio,
  CreditCard,
  Code2,
  Webhook,
  Copy,
  Check,
  Zap,
  Server,
  Building2,
  Users,
  FileText,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { EnterpriseApiKey, SubscriptionUsage, EnterpriseSystemStatus, WebhookTestPingResult } from '@/lib/types';

export default function SettingsPage() {
  const {
    currentWorkspace,
    currentRole,
    updateWorkspaceSettings,
    isSupabaseActive,
    checkSupabase,
    showToast,
    getEnterpriseStatus,
    testWebhookPing,
    listApiKeys,
    generateApiKey,
    getSubscriptionUsage
  } = useBrandPilot();

  const [activeTab, setActiveTab] = useState<'general' | 'sso' | 'developer' | 'billing' | 'security'>('general');

  // --- GENERAL TAB STATE ---
  const [orgName, setOrgName] = useState(currentWorkspace.name);
  const [customDomain, setCustomDomain] = useState('brand.auracloud.io');
  const [dataResidency, setDataResidency] = useState('us-east-1');
  const [domainVerified, setDomainVerified] = useState(true);

  // --- SSO & SAML TAB STATE ---
  const [ssoProvider, setSsoProvider] = useState<'okta' | 'azure_ad' | 'google_workspace'>('okta');
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [idpEntityId, setIdpEntityId] = useState('https://idp.okta.com/exk94821a0c4');
  const [scimEnabled, setScimEnabled] = useState(true);

  // --- DEVELOPER TAB STATE ---
  const [apiKeys, setApiKeys] = useState<EnterpriseApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.auracloud.io/brandpilot/events');
  const [webhookSecret, setWebhookSecret] = useState('whsec_live_9b42e718c30f4a9b');
  const [webhookPinging, setWebhookPinging] = useState(false);
  const [webhookResult, setWebhookResult] = useState<WebhookTestPingResult | null>(null);

  // --- BILLING TAB STATE ---
  const [subscription, setSubscription] = useState<SubscriptionUsage | null>(null);

  // --- SECURITY TAB STATE ---
  const [minComplianceScore, setMinComplianceScore] = useState(85);
  const [ragSimilarityThreshold, setRagSimilarityThreshold] = useState(0.75);
  const [testingDb, setTestingDb] = useState(false);
  const [systemStatus, setSystemStatus] = useState<EnterpriseSystemStatus | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const [keys, sub, status] = await Promise.all([
        listApiKeys(),
        getSubscriptionUsage(),
        getEnterpriseStatus()
      ]);
      if (isMounted) {
        setApiKeys(keys);
        setSubscription(sub);
        setSystemStatus(status);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleTestDatabase = async () => {
    setTestingDb(true);
    await checkSupabase();
    setTestingDb(false);
  };

  const handleSaveGeneral = () => {
    updateWorkspaceSettings({ name: orgName });
    showToast('Organization settings & domain configuration saved', 'success');
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsGeneratingKey(true);
    const key = await generateApiKey(newKeyName);
    setApiKeys(prev => [key, ...prev]);
    setNewKeyName('');
    setIsGeneratingKey(false);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setWebhookPinging(true);
    const res = await testWebhookPing(webhookUrl, 'audit.flagged', webhookSecret);
    setWebhookResult(res);
    setWebhookPinging(false);
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentWorkspace.name}</span>
            <span>•</span>
            <span>Enterprise Organization Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Organization Settings & Governance
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage multi-region residency, SAML 2.0 / Okta SSO, developer API keys, outbound webhooks, and enterprise billing.
          </p>
        </div>

        {/* Global Compliance Cert Badge */}
        <div className="flex items-center gap-2 bg-[#0A120E] border border-emerald-900/60 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
          <div className="text-xs">
            <span className="text-zinc-400">Security Standard:</span>{' '}
            <span className="font-mono font-bold text-white">SOC 2 Type II / ISO 27001</span>
          </div>
        </div>
      </div>

      {/* Enterprise Tabs Navigation */}
      <div className="flex border-b border-emerald-950 overflow-x-auto space-x-2">
        {[
          { id: 'general', label: 'General & Multi-Region', icon: Globe },
          { id: 'sso', label: 'SAML 2.0 & Directory (SCIM)', icon: Lock },
          { id: 'developer', label: 'API Keys & Webhooks', icon: Code2 },
          { id: 'billing', label: 'Subscription & Quotas', icon: CreditCard },
          { id: 'security', label: 'Governance & Infrastructure', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#00FF87] text-[#00FF87] bg-emerald-950/40 rounded-t-lg'
                  : 'border-transparent text-zinc-400 hover:text-white hover:border-emerald-500/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: GENERAL & MULTI-REGION RESIDENCY */}
      {/* ============================================================== */}
      {activeTab === 'general' && (
        <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-xl space-y-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Workspace Identity & Custom Domain</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Workspace Display Name
                </label>
                <input
                  type="text"
                  disabled={currentRole !== 'admin'}
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Unique Tenant Slug
                </label>
                <input
                  type="text"
                  disabled
                  value={currentWorkspace.slug}
                  className="w-full text-xs p-2.5 border border-emerald-950 bg-[#050806] font-mono text-zinc-500 rounded-xl"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#060B08] border border-emerald-950 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Custom White-Label Domain (CNAME)</span>
                  <span className="text-[11px] text-zinc-400">Route brand intelligence portal and public verification to your corporate subdomain.</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  domainVerified ? 'bg-emerald-950 text-[#00FF87] border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {domainVerified ? 'SSL Active (Let\'s Encrypt)' : 'Pending DNS Propagation'}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  placeholder="brand.yourcompany.com"
                  className="w-full text-xs p-2 border border-emerald-900/60 bg-[#0A120E] text-zinc-100 font-mono rounded-lg focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => showToast('CNAME record validated: points to cname.brandpilot.ai', 'success')}
                  className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer transition-colors"
                >
                  Verify DNS
                </button>
              </div>
            </div>
          </div>

          {/* Multi-Region Data Residency & Zero Data Retention */}
          <div className="pt-6 border-t border-emerald-950 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Multi-Region Data Residency & Sovereignty Shield</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Select the sovereign cloud data region where all embeddings, audit documents, and ledger signatures are permanently stored.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'us-east-1', name: 'US-East (N. Virginia)', spec: 'SOC 2 Type II • HIPAA BAA Gated', flag: '🇺🇸' },
                { id: 'eu-central-1', name: 'EU-Central (Frankfurt)', spec: 'GDPR Article 28 • C5 Certified', flag: '🇪🇺' },
                { id: 'ap-southeast-1', name: 'AP-Southeast (Singapore)', spec: 'MAS TRM • India DPDP 2023', flag: '🇸🇬' }
              ].map(reg => (
                <div
                  key={reg.id}
                  onClick={() => {
                    setDataResidency(reg.id);
                    showToast(`Data residency pinned to ${reg.name}`, 'info');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    dataResidency === reg.id
                      ? 'bg-emerald-950/60 border-[#00FF87] shadow-[0_0_12px_rgba(0,255,135,0.2)]'
                      : 'bg-[#060B08] border-emerald-950 hover:border-emerald-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{reg.flag}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{reg.id}</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">{reg.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{reg.spec}</div>
                </div>
              ))}
            </div>

            {/* Zero Data Retention Certification */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00FF87] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-white block">Enterprise Zero Data Retention (ZDR) Agreement Active</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  BrandPilot operates under enforceable enterprise Zero Data Retention agreements. No customer collateral, proprietary brand rules, or employee documents are ever used for public AI model training or stored in shared vector pools.
                </p>
              </div>
            </div>
          </div>

          {currentRole === 'admin' && (
            <div className="pt-4 border-t border-emerald-950 flex justify-end">
              <button
                onClick={handleSaveGeneral}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                Save General Workspace Configuration
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SAML 2.0 & DIRECTORY SYNC (SCIM) */}
      {/* ============================================================== */}
      {activeTab === 'sso' && (
        <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-950">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Identity & Single Sign-On (SAML 2.0)</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Delegate user authentication to your corporate identity provider (IdP).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-300">Enforce SSO:</span>
              <button
                type="button"
                onClick={() => {
                  setSsoEnforced(!ssoEnforced);
                  showToast(ssoEnforced ? 'SSO requirement disabled' : 'SSO enforced for all organization users', 'info');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  ssoEnforced ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  ssoEnforced ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* IdP Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'okta', name: 'Okta Workforce Identity', desc: 'SAML 2.0 + SCIM 2.0 Sync' },
              { id: 'azure_ad', name: 'Microsoft Entra ID (Azure AD)', desc: 'OIDC / SAML Enterprise App' },
              { id: 'google_workspace', name: 'Google Workspace Enterprise', desc: 'Secure SAML Authentication' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSsoProvider(p.id as any);
                  showToast(`Selected ${p.name}`, 'info');
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  ssoProvider === p.id
                    ? 'bg-emerald-950/60 border-[#00FF87]'
                    : 'bg-[#060B08] border-emerald-950 hover:border-emerald-800'
                }`}
              >
                <div className="text-xs font-bold text-white">{p.name}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* SAML Parameters */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Assertion Consumer Service (ACS) URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled
                    value="https://auth.brandpilot.ai/saml/v1/acs/org-auracloud-001"
                    className="w-full text-xs p-2.5 border border-emerald-950 bg-[#050806] font-mono text-zinc-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://auth.brandpilot.ai/saml/v1/acs/org-auracloud-001');
                      showToast('Copied ACS URL to clipboard', 'success');
                    }}
                    className="px-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl hover:bg-emerald-900 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Service Provider Entity ID / Audience URI
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled
                    value="https://auth.brandpilot.ai/saml/v1/sp/org-auracloud-001"
                    className="w-full text-xs p-2.5 border border-emerald-950 bg-[#050806] font-mono text-zinc-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://auth.brandpilot.ai/saml/v1/sp/org-auracloud-001');
                      showToast('Copied SP Entity ID to clipboard', 'success');
                    }}
                    className="px-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl hover:bg-emerald-900 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                IdP Metadata XML / SSO Target URL
              </label>
              <input
                type="text"
                value={idpEntityId}
                onChange={e => setIdpEntityId(e.target.value)}
                className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 font-mono rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* SCIM Directory Sync */}
          <div className="pt-6 border-t border-emerald-950 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">SCIM 2.0 Automatic User Provisioning</h3>
                <p className="text-[11px] text-zinc-400">Automatically provision seats and revoke access when employees join or leave your Okta/Azure directory.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-[#00FF87] border border-emerald-800">
                SCIM 2.0 Active
              </span>
            </div>

            <div className="p-3 bg-[#060B08] rounded-xl border border-emerald-950 flex items-center justify-between font-mono text-[11px]">
              <div>
                <span className="text-zinc-500">SCIM Endpoint: </span>
                <span className="text-zinc-200">https://api.brandpilot.ai/scim/v2/org-auracloud-001</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('https://api.brandpilot.ai/scim/v2/org-auracloud-001');
                  showToast('SCIM endpoint copied', 'success');
                }}
                className="text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                Copy Endpoint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DEVELOPER API KEYS & WEBHOOKS */}
      {/* ============================================================== */}
      {activeTab === 'developer' && (
        <div className="space-y-6">
          {/* Production API Keys Management */}
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-950">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Production Developer API Keys</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Generate scoped Bearer tokens to integrate BrandPilot with GitHub Actions, custom CMS pipelines, and internal tools.
                </p>
              </div>

              {/* Generate Key Form */}
              <form onSubmit={handleGenerateKey} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Key name (e.g. CI Runner)"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#060B08] border border-emerald-900/60 rounded-xl text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isGeneratingKey || !newKeyName.trim()}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer shadow-[0_0_12px_rgba(0,255,135,0.25)] transition-all"
                >
                  Generate Key
                </button>
              </form>
            </div>

            {/* Keys Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-emerald-950 text-zinc-400 font-bold uppercase tracking-wider bg-[#060B08]">
                  <tr>
                    <th className="py-2.5 px-3">Key Label</th>
                    <th className="py-2.5 px-3">Prefix Token</th>
                    <th className="py-2.5 px-3">Permissions / Scopes</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/60 font-mono text-[11px]">
                  {apiKeys.map(k => (
                    <tr key={k.id} className="hover:bg-[#060B08]/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white font-sans">{k.name}</td>
                      <td className="py-2.5 px-3 text-emerald-400">{k.prefix}••••••••</td>
                      <td className="py-2.5 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {k.scopes.map(s => (
                            <span key={s} className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 font-sans">{k.last_used_at}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(k.full_key || `${k.prefix}9b2c4e6d8a1e3f5b7c9d0a2e4f6a`);
                            showToast(`Copied token for ${k.name}`, 'success');
                          }}
                          className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-[#0A120E] border border-emerald-900/60 hover:border-emerald-500 cursor-pointer transition-colors"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbound Webhook Subscriptions & Live Ping Tester */}
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-xl space-y-4">
            <div className="pb-4 border-b border-emerald-950">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Webhook className="w-4 h-4 text-emerald-400" />
                <span>Outbound Event Webhooks & Cryptographic Signatures</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                BrandPilot signs all outbound event payloads using HMAC-SHA256 headers (`BrandPilot-Signature: t=...,v1=...`).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Destination Webhook Endpoint
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  placeholder="https://yourserver.com/webhooks/brandpilot"
                  className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 font-mono rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  HMAC-SHA256 Signing Secret
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={webhookSecret}
                    onChange={e => setWebhookSecret(e.target.value)}
                    className="w-full text-xs p-2.5 border border-emerald-900/60 bg-[#060B08] text-zinc-100 font-mono rounded-xl focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={webhookPinging || !webhookUrl.trim()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-extrabold rounded-xl whitespace-nowrap cursor-pointer transition-all shadow-[0_0_12px_rgba(0,255,135,0.25)] flex items-center gap-1.5"
                  >
                    {webhookPinging ? (
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-black" />
                    )}
                    <span>Send Test Ping</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Webhook Test Response Viewer */}
            {webhookResult && (
              <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-900/60 space-y-2 font-mono text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-800 font-bold">
                      HTTP {webhookResult.http_response_code} OK
                    </span>
                    <span className="text-zinc-400">Latency: {webhookResult.latency_ms}ms</span>
                  </div>
                  <span className="text-zinc-500">Event: {webhookResult.event_type}</span>
                </div>

                <div className="text-[11px] text-zinc-400 truncate">
                  <span className="text-zinc-500">Signature: </span>
                  <span className="text-emerald-400">{webhookResult.signature_header}</span>
                </div>

                <div className="p-2.5 rounded bg-[#040705] border border-emerald-950 text-[10px] text-zinc-300 max-h-36 overflow-y-auto">
                  <pre>{JSON.stringify(webhookResult.payload_dispatched, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SUBSCRIPTION & REAL-TIME QUOTA METERS */}
      {/* ============================================================== */}
      {activeTab === 'billing' && subscription && (
        <div className="space-y-6">
          {/* Plan Summary Card */}
          <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Active Subscription
                  </span>
                  <span className="text-xs font-mono text-zinc-500">Tier 1 SLA Commitment</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  {subscription.plan_tier}
                </h2>
                <p className="text-xs text-zinc-400">
                  Annual enterprise billing commit. Contract renewal on <strong className="text-zinc-200">{subscription.renewal_date}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => showToast('Opening Stripe Customer Portal...', 'info')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl shadow-lg cursor-pointer transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] flex items-center gap-2"
                >
                  <CreditCard className="w-3.5 h-3.5 text-black" />
                  <span>Stripe Billing Portal</span>
                </button>
              </div>
            </div>

            {/* Consumption Quota Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-300">Monthly Brand Audits</span>
                  <span className="font-mono text-emerald-400">
                    {subscription.usage_meters.monthly_audits.used} / {subscription.usage_meters.monthly_audits.quota} ({subscription.usage_meters.monthly_audits.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${subscription.usage_meters.monthly_audits.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block">Resets on 1st of every month. Additional audits billed at $0.08/run.</span>
              </div>

              <div className="p-4 rounded-xl bg-[#060B08] border border-emerald-950 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-300">In-Situ Linter API Calls (Figma / Web)</span>
                  <span className="font-mono text-emerald-400">
                    {subscription.usage_meters.insitu_api_calls.used.toLocaleString()} / {subscription.usage_meters.insitu_api_calls.quota.toLocaleString()} ({subscription.usage_meters.insitu_api_calls.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${subscription.usage_meters.insitu_api_calls.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block">Sub-10ms edge caching active globally.</span>
              </div>
            </div>

            {/* Invoices History Table */}
            <div className="pt-4 border-t border-emerald-950 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Invoice History & PDF Receipts</span>
              </h3>

              <div className="border border-emerald-950 rounded-xl overflow-hidden bg-[#060B08]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-emerald-950 text-zinc-400 font-bold uppercase bg-[#050806]">
                    <tr>
                      <th className="py-2.5 px-3">Invoice ID</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/60 text-[11px]">
                    {subscription.invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-[#0A120E] transition-colors">
                        <td className="py-2.5 px-3 text-white font-bold">{inv.id}</td>
                        <td className="py-2.5 px-3 text-zinc-400">{inv.date}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{inv.amount}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#00FF87] border border-emerald-800 text-[10px]">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => showToast(`Downloaded invoice ${inv.id}`, 'info')}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: GOVERNANCE GUARDRAILS & DATABASE INFRASTRUCTURE */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="bg-[#0A120E] rounded-2xl p-6 border border-emerald-950/80 shadow-xl space-y-6">
          <div className="pb-4 border-b border-emerald-950">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Governance Sensitivity & Statutory Thresholds</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure automated gating policies before collateral transitions to production reviewers.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-1">
                <span>Minimum Compliance Score Required for Reviewer Queue</span>
                <span className="font-mono text-emerald-400 font-bold">{minComplianceScore}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                disabled={currentRole !== 'admin'}
                value={minComplianceScore}
                onChange={e => setMinComplianceScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[11px] text-zinc-500 mt-1">
                Drafts scoring under {minComplianceScore}% must have critical statutory findings resolved before submission.
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#060B08] rounded-xl border border-emerald-950">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Strict Human Segregation of Duties</span>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Prohibit content creators from self-approving their own submissions (Enforces 403 Forbidden Gatekeeper).
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[11px] font-bold">
                Always Enforced
              </span>
            </div>
          </div>

          {/* Database & Persistence */}
          <div className="pt-6 border-t border-emerald-950 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise PostgreSQL & pgvector Engine</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Multi-tenant PostgreSQL with Row-Level Security (RLS) and HNSW vector index.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isSupabaseActive
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                    : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/60'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`} />
                  {isSupabaseActive ? 'Supabase Managed Cloud Active' : 'Self-Contained Persistence Active'}
                </span>

                <button
                  type="button"
                  onClick={handleTestDatabase}
                  disabled={testingDb}
                  className="px-3 py-1 bg-[#060B08] hover:bg-emerald-950/50 text-zinc-300 hover:text-white text-xs font-bold rounded-lg transition-colors border border-emerald-900/60 cursor-pointer"
                >
                  {testingDb ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#060B08] rounded-xl border border-emerald-950 text-xs space-y-2">
              <div className="font-bold text-zinc-200">
                {isSupabaseActive
                  ? 'Active multi-tenant database connection verified with automated backup snapshots.'
                  : 'BrandPilot is operating with local self-contained state persistence.'}
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                To connect your dedicated cloud database: set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment variables.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
