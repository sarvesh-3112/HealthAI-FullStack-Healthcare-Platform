'use client';
import { useState, useEffect } from 'react';

const PATIENTS = [
  { id: 'pat-001', name: 'Priya Sharma',   age: 34, gender: 'F', risk: 'low',    condition: 'Common Cold',  last_visit: '2026-03-12', predictions: 3 },
  { id: 'pat-002', name: 'Rahul Verma',    age: 41, gender: 'M', risk: 'high',   condition: 'Pneumonia',    last_visit: '2026-03-11', predictions: 7 },
  { id: 'pat-003', name: 'Anita Krishnan', age: 29, gender: 'F', risk: 'medium', condition: 'Dengue Fever', last_visit: '2026-03-10', predictions: 2 },
  { id: 'pat-004', name: 'Karan Patel',    age: 55, gender: 'M', risk: 'low',    condition: 'Diabetes',     last_visit: '2026-03-09', predictions: 12 },
  { id: 'pat-005', name: 'Meera Nair',     age: 22, gender: 'F', risk: 'high',   condition: 'Tuberculosis', last_visit: '2026-03-08', predictions: 5 },
  { id: 'pat-006', name: 'Suresh Kumar',   age: 67, gender: 'M', risk: 'high',   condition: 'Hypertension', last_visit: '2026-03-07', predictions: 8 },
  { id: 'pat-007', name: 'Divya Menon',    age: 38, gender: 'F', risk: 'medium', condition: 'Asthma',       last_visit: '2026-03-06', predictions: 4 },
];

const ANALYTICS = {
  total: 124, highRisk: 18, mediumRisk: 42, lowRisk: 64, todayPredictions: 37,
  topConditions: [
    { disease: 'Influenza', count: 28 }, { disease: 'Hypertension', count: 22 },
    { disease: 'Diabetes', count: 19 },  { disease: 'Common Cold', count: 17 },
    { disease: 'Asthma', count: 14 },
  ],
};

interface Props { onLogout: () => void; }

export default function HospitalDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<'home' | 'patients' | 'analytics' | 'notes'>('home');
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const saveNote = () => {
    if (!noteText.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
    setNoteText('');
  };

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Overview' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'notes', icon: '📝', label: 'Doctor Notes' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a1628' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '220px', minHeight: '100vh', padding: '20px 14px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '0 6px' }}>
          <span style={{ fontSize: '20px' }}>🏥</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#f0fdf4' }}>HealthAI</div>
            <div style={{ fontSize: '10px', color: '#4ade80', fontWeight: 600 }}>HOSPITAL</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id as any)} className={`sidebar-link ${tab === item.id ? 'active' : ''}`}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '14px' }}>
          <div style={{ padding: '0 6px', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Dr. Arjun Mehta</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Apollo General Hospital</div>
          </div>
          <button onClick={onLogout} className="sidebar-link" style={{ color: '#f87171' }}>
            <span>🚪</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

        {/* OVERVIEW */}
        {tab === 'home' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Clinical Overview</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Apollo General Hospital — Today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Patients', value: ANALYTICS.total, icon: '👥', color: '#4ade80' },
                { label: 'High Risk', value: ANALYTICS.highRisk, icon: '🚨', color: '#f87171' },
                { label: 'Medium Risk', value: ANALYTICS.mediumRisk, icon: '⚠️', color: '#fbbf24' },
                { label: 'Predictions Today', value: ANALYTICS.todayPredictions, icon: '🧠', color: '#60a5fa' },
              ].map(m => (
                <div key={m.label} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span>{m.icon}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Recent patients */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Recent Patients</h2>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th><th>Condition</th><th>Risk</th><th>Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {PATIENTS.slice(0, 5).map(p => (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedPatient(p); setTab('patients'); }}>
                      <td>{p.name}</td>
                      <td style={{ color: '#94a3b8' }}>{p.condition}</td>
                      <td><span className={`risk-badge risk-${p.risk}`}>{p.risk}</span></td>
                      <td style={{ color: '#64748b' }}>{p.last_visit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PATIENTS */}
        {tab === 'patients' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Patient List</h1>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>All patients under Apollo General Hospital</p>
            <input className="input-field" style={{ maxWidth: '360px', marginBottom: '20px' }} placeholder="🔍 Search patients..." value={search} onChange={e => setSearch(e.target.value)} />

            {selectedPatient ? (
              <div className="animate-slide-up">
                <button className="btn-ghost" onClick={() => setSelectedPatient(null)} style={{ marginBottom: '20px' }}>← Back to list</button>
                <div className="glass-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
                      {selectedPatient.name[0]}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedPatient.name}</h2>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>Age {selectedPatient.age} · {selectedPatient.gender === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                    <span className={`risk-badge risk-${selectedPatient.risk}`} style={{ marginLeft: 'auto', fontSize: '13px', padding: '6px 14px' }}>{selectedPatient.risk.toUpperCase()} RISK</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    {[
                      { label: 'Latest Condition', value: selectedPatient.condition },
                      { label: 'Total Predictions', value: selectedPatient.predictions },
                      { label: 'Last Visit', value: selectedPatient.last_visit },
                      { label: 'Patient ID', value: selectedPatient.id },
                    ].map(f => (
                      <div key={f.label} style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{f.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-green" style={{ marginTop: '20px' }} onClick={() => { setTab('notes'); setSelectedPatient(selectedPatient); }}>
                    📝 Add Doctor Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card">
                <table>
                  <thead>
                    <tr>
                      <th>Patient Name</th><th>Age</th><th>Latest Condition</th><th>Risk Level</th><th>Last Visit</th><th>Predictions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedPatient(p)}>
                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                        <td style={{ color: '#94a3b8' }}>{p.age}</td>
                        <td style={{ color: '#94a3b8' }}>{p.condition}</td>
                        <td><span className={`risk-badge risk-${p.risk}`}>{p.risk}</span></td>
                        <td style={{ color: '#64748b' }}>{p.last_visit}</td>
                        <td style={{ color: '#fbbf24', fontWeight: 600 }}>{p.predictions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Hospital Analytics</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Disease distribution and risk patterns</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Risk Distribution */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Risk Distribution</h3>
                {[
                  { label: 'Low Risk', count: ANALYTICS.lowRisk, pct: Math.round(ANALYTICS.lowRisk / ANALYTICS.total * 100), color: '#34d399' },
                  { label: 'Medium Risk', count: ANALYTICS.mediumRisk, pct: Math.round(ANALYTICS.mediumRisk / ANALYTICS.total * 100), color: '#fbbf24' },
                  { label: 'High Risk', count: ANALYTICS.highRisk, pct: Math.round(ANALYTICS.highRisk / ANALYTICS.total * 100), color: '#f87171' },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{r.label}</span>
                      <span style={{ fontWeight: 700, color: r.color }}>{r.count} ({r.pct}%)</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '4px', background: r.color, width: `${r.pct}%`, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Conditions */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Top Conditions</h3>
                {ANALYTICS.topConditions.map((c, i) => (
                  <div key={c.disease} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < ANALYTICS.topConditions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>{i + 1}</span>
                      <span style={{ fontSize: '14px' }}>{c.disease}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#4ade80' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Avg Daily Predictions', value: '37', icon: '📊' },
                { label: 'Model Accuracy', value: '94.7%', icon: '🎯' },
                { label: 'Total Records', value: '8,432', icon: '📋' },
                { label: 'Staff Members', value: '12', icon: '👨‍⚕️' },
              ].map(m => (
                <div key={m.label} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '28px' }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#4ade80' }}>{m.value}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>{m.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === 'notes' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Doctor Notes</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Add clinical observations for your patients</p>

            <div className="glass-card" style={{ padding: '24px', maxWidth: '680px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Patient</label>
                <select style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none' }}>
                  {PATIENTS.map(p => <option key={p.id} value={p.id} style={{ background: '#1e293b' }}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Clinical Note</label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={6}
                  placeholder="Enter your clinical observations, diagnoses, and treatment notes..."
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="btn-green" onClick={saveNote} disabled={!noteText.trim()}>
                  💾 Save Note
                </button>
                {noteSaved && <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: 600 }}>✓ Note saved successfully!</span>}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
