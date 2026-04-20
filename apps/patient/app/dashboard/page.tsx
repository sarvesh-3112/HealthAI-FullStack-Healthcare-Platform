'use client';
import { useState, useEffect } from 'react';

const SYMPTOMS_LIST = [
  'fever','cough','fatigue','headache','body aches','chills','sore throat','runny nose',
  'nausea','vomiting','diarrhea','shortness of breath','chest pain','rash','joint pain',
  'muscle pain','dizziness','blurred vision','loss of appetite','weight loss',
  'frequent urination','excessive thirst','burning urination','abdominal pain',
  'high fever','severe headache','sensitivity to light','itchiness','jaundice',
  'night sweats','persistent cough','coughing up blood','wheezing','chest tightness',
  'swelling','stiffness','pale skin','cold hands','sneezing','congestion','loss of taste','loss of smell',
];

interface PredictResult {
  predictions: Array<{ disease: string; probability: number }>;
  risk_level: 'low' | 'medium' | 'high';
  recommendation: string;
  top_disease: string;
  top_probability: number;
  demo_mode?: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'checker' | 'results' | 'history' | 'profile'>('home');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Load user and history from localStorage
    const savedUser = localStorage.getItem('healthai_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedHistory = localStorage.getItem('healthai_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('healthai_user');
    localStorage.removeItem('healthai_token');
    window.location.href = '/'; // Simple redirection for demo
  };

  const filteredSymptoms = SYMPTOMS_LIST.filter(s =>
    s.includes(symptomSearch.toLowerCase()) && !selectedSymptoms.includes(s)
  );

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const runPrediction = async () => {
    if (!selectedSymptoms.length) return;
    setPredicting(true);
    try {
      const res = await fetch(`${API}/predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        const entry = { ...data, symptoms: selectedSymptoms, created_at: new Date().toISOString(), id: Date.now() };
        const newHistory = [entry, ...history].slice(0, 20);
        setHistory(newHistory);
        localStorage.setItem('healthai_history', JSON.stringify(newHistory));
        setActiveTab('results');
      }
    } catch {
      // Demo result
      const demo: PredictResult = {
        predictions: [
          { disease: 'Influenza', probability: 0.62 },
          { disease: 'Common Cold', probability: 0.25 },
          { disease: 'Viral Infection', probability: 0.08 },
          { disease: 'COVID-19', probability: 0.05 },
        ],
        risk_level: 'medium',
        recommendation: 'Monitor symptoms. Consult a doctor soon.',
        top_disease: 'Influenza',
        top_probability: 0.62,
        demo_mode: true,
      };
      setResult(demo);
      const entry = { ...demo, symptoms: selectedSymptoms, created_at: new Date().toISOString(), id: Date.now() };
      const newHistory = [entry, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('healthai_history', JSON.stringify(newHistory));
      setActiveTab('results');
    } finally { setPredicting(false); }
  };

  const riskColors: Record<string, string> = { low: '#34d399', medium: '#fbbf24', high: '#f87171' };
  const riskEmoji: Record<string, string> = { low: '✅', medium: '⚠️', high: '🚨' };

  const navItems = [
    { id: 'home',    icon: '🏠', label: 'Home' },
    { id: 'checker', icon: '🩺', label: 'Symptom Checker' },
    { id: 'results', icon: '📊', label: 'Results' },
    { id: 'history', icon: '📋', label: 'History' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '240px', minHeight: '100vh', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
          <span style={{ fontSize: '22px' }}>🏥</span>
          <span style={{ fontWeight: 800, fontSize: '18px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HealthAI</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', color: 'inherit', cursor: 'pointer', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ padding: '0 8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{user?.full_name || user?.email || 'Patient'}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Patient Portal</div>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: '#f87171', cursor: 'pointer', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>🚪</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              Welcome back, <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.full_name?.split(' ')[0] || 'Patient'}</span> 👋
            </h1>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>How are you feeling today?</p>

            {/* Quick action */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.10))', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setActiveTab('checker')}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🩺</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Check Symptoms</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Get an AI-powered disease prediction in seconds</p>
                <button style={{ marginTop: '16px', padding: '10px 20px', fontSize: '14px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Start Check-up →</button>
              </div>
              {result && (
                <div className="glass-card" style={{ padding: '28px', cursor: 'pointer', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setActiveTab('results')}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{riskEmoji[result.risk_level]}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Last Result</h3>
                  <p style={{ color: riskColors[result.risk_level], fontWeight: 600 }}>{result.top_disease}</p>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{Math.round(result.top_probability * 100)}% probability</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { icon: '📊', label: 'Total Predictions', value: history.length.toString(), color: '#60a5fa' },
                { icon: '🦠', label: 'Last Condition', value: history[0]?.top_disease || 'None yet', color: '#a78bfa' },
                { icon: '⚠️', label: 'Risk Level', value: history[0]?.risk_level || 'N/A', color: riskColors[history[0]?.risk_level || 'low'] },
                { icon: '📅', label: 'Last Check', value: history[0] ? new Date(history[0].created_at).toLocaleDateString() : 'Never', color: '#34d399' },
              ].map(m => (
                <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span>{m.icon}</span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYMPTOM CHECKER TAB */}
        {activeTab === 'checker' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>🩺 Symptom Checker</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Select all symptoms you are experiencing for an AI prediction.</p>

            {selectedSymptoms.length > 0 && (
              <div style={{ padding: '20px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>Selected ({selectedSymptoms.length})</span>
                  <button onClick={() => setSelectedSymptoms([])} style={{ fontSize: '12px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedSymptoms.map(s => (
                    <span key={s} onClick={() => toggleSymptom(s)} style={{ background: '#3b82f6', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>
                      {s} ✕
                    </span>
                  ))}
                </div>
              </div>
            )}

            <input
              style={{ width: '100%', padding: '14px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', marginBottom: '16px' }}
              placeholder="🔍 Search symptoms..."
              value={symptomSearch}
              onChange={e => setSymptomSearch(e.target.value)}
            />

            <div style={{ padding: '20px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', marginBottom: '16px' }}>
                {symptomSearch ? `Results for "${symptomSearch}"` : 'All Symptoms'} — click to select
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {filteredSymptoms.map(s => (
                  <span
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    style={{
                      background: selectedSymptoms.includes(s) ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                      color: selectedSymptoms.includes(s) ? 'white' : '#94a3b8',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={runPrediction}
              disabled={!selectedSymptoms.length || predicting}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                opacity: !selectedSymptoms.length || predicting ? 0.5 : 1
              }}
            >
              {predicting ? '⏳ Analyzing symptoms...' : `🧠 Analyze ${selectedSymptoms.length} Symptom${selectedSymptoms.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>📊 AI Prediction Results</h1>
            {!result ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🩺</div>
                <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '24px' }}>No prediction yet. Run the symptom checker first.</p>
                <button style={{ padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }} onClick={() => setActiveTab('checker')}>→ Go to Symptom Checker</button>
              </div>
            ) : (
              <div>
                <div style={{ padding: '24px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `4px solid ${riskColors[result.risk_level]}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '32px' }}>{riskEmoji[result.risk_level]}</span>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: riskColors[result.risk_level] }}>
                        {result.risk_level.toUpperCase()} RISK — {result.top_disease}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{result.recommendation}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '24px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Top Disease Predictions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {result.predictions.map((pred, i) => (
                      <div key={pred.disease}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, color: i === 0 ? '#e2e8f0' : '#94a3b8' }}>{pred.disease}</span>
                          <span style={{ fontWeight: 700, color: i === 0 ? '#60a5fa' : '#64748b' }}>{Math.round(pred.probability * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pred.probability * 100}%`, background: i === 0 ? '#3b82f6' : '#64748b' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px' }}>Symptoms Analyzed</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedSymptoms.map(s => (
                      <span key={s} style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{s}</span>
                    ))}
                  </div>
                  <button style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', cursor: 'pointer' }} onClick={() => { setSelectedSymptoms([]); setActiveTab('checker'); }}>
                    🔄 New Check-up
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs follow similar structure... skipping detailed implementation of History/Profile for brevity but keeping them logic-linked */}
        {activeTab === 'history' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>📋 Medical History</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Your past AI-powered health assessments</p>
            {history.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ color: '#64748b' }}>No history found.</p>
               </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {history.map((entry, i) => (
                  <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700 }}>{entry.top_disease}</span>
                      <span style={{ fontSize: '12px', color: riskColors[entry.risk_level] }}>{entry.risk_level?.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{new Date(entry.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-slide-up">
             <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>👤 Patient Profile</h1>
             <div style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{user?.full_name || 'Patient'}</div>
                <div style={{ color: '#64748b', marginBottom: '20px' }}>{user?.email}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Blood Type</div>
                    <div>O+</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Status</div>
                    <div style={{ color: '#34d399' }}>Active</div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
