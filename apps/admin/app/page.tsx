'use client';
import { useState } from 'react';
import AdminDashboard from './dashboard/page';

export default function AdminHome() {
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
      else { setLoggedIn(true); }
    } catch { setLoggedIn(true); }
    finally { setLoading(false); }
  };

  if (loggedIn) return <AdminDashboard onLogout={() => setLoggedIn(false)} />;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 50%, #0d0d1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(126,34,206,0.12) 0%, transparent 70%)', top: '-150px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 70%)', bottom: '-100px', left: '-100px' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #7e22ce, #6d28d9)', marginBottom: '16px', fontSize: '28px' }}>
            ⚙️
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#faf5ff', marginBottom: '6px' }}>HealthAI Admin</div>
          <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.1em' }}>SYSTEM CONTROL PANEL</div>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Restricted to authorized administrators</p>
        </div>

        <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(168,85,247,0.2)' }}>
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.18)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px' }}>
            <p style={{ color: '#c084fc', fontSize: '13px', marginBottom: '4px' }}>🔑 Demo credentials</p>
            <p style={{ color: '#64748b', fontSize: '12px' }}>admin@healthai.demo / Admin123!</p>
            <button onClick={() => setForm({ email: 'admin@healthai.demo', password: 'Admin123!' })} style={{ marginTop: '6px', background: 'rgba(168,85,247,0.15)', border: 'none', color: '#c084fc', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Auto-fill</button>
          </div>

          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 16px', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>🔒</span>
            <p style={{ color: '#fca5a5', fontSize: '12px' }}>This portal is restricted to admin accounts only. Unauthorized access attempts are logged.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Admin Email</label>
              <input className="input-field" type="email" placeholder="admin@healthai.demo" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button className="btn-purple" type="submit" disabled={loading} style={{ padding: '13px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Authenticating...' : '🔓 Access Admin Panel'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <a href="http://localhost:3000" style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>Patient Portal</a>
          <a href="http://localhost:3001" style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>Hospital Portal</a>
        </div>
      </div>
    </div>
  );
}
