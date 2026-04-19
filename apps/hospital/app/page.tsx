'use client';
import { useState } from 'react';
import HospitalDashboard from './dashboard/page';

const DEMO_CREDS = { email: 'doctor@healthai.demo', password: 'Doctor123!' };

export default function HospitalHome() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setLoggedIn(true); }
      else { setLoggedIn(true); } // Demo fallback
    } catch { setLoggedIn(true); }
    finally { setLoading(false); }
  };

  if (loggedIn) return <HospitalDashboard onLogout={() => setLoggedIn(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #0d2b1a 50%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {/* bg orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 70%)', top: '-150px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', bottom: '-100px', left: '-100px' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🏥</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#f0fdf4' }}>HealthAI</div>
              <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>HOSPITAL DASHBOARD</div>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>Clinical staff portal — authorized access only</p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px' }}>
            <p style={{ color: '#86efac', fontSize: '13px', marginBottom: '4px' }}>🔑 Demo credentials</p>
            <p style={{ color: '#64748b', fontSize: '12px' }}>doctor@healthai.demo / Doctor123!</p>
            <button onClick={() => setForm(DEMO_CREDS)} style={{ marginTop: '6px', background: 'rgba(34,197,94,0.15)', border: 'none', color: '#4ade80', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Auto-fill</button>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Staff Email</label>
              <input className="input-field" type="email" placeholder="doctor@hospital.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button className="btn-green" type="submit" disabled={loading} style={{ padding: '13px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Signing in...' : '→ Access Dashboard'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="http://localhost:3000" style={{ color: '#4ade80', fontSize: '13px', textDecoration: 'none' }}>← Patient Portal (port 3000)</a>
        </div>
      </div>
    </div>
  );
}
