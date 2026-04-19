'use client';
import { useState } from 'react';

const USERS = [
  { id: 'user-001', email: 'patient@healthai.demo', role: 'patient',       name: 'Priya Sharma',    created: '2026-01-10', active: true },
  { id: 'user-002', email: 'doctor@healthai.demo',  role: 'organization',  name: 'Dr. Arjun Mehta', created: '2026-01-05', active: true },
  { id: 'user-003', email: 'admin@healthai.demo',   role: 'admin',         name: 'Admin User',      created: '2026-01-01', active: true },
  { id: 'user-004', email: 'rahul@example.com',     role: 'patient',       name: 'Rahul Verma',     created: '2026-01-15', active: true },
  { id: 'user-005', email: 'dr.sinha@hospital.com', role: 'organization',  name: 'Dr. Sinha',       created: '2026-01-20', active: false },
  { id: 'user-006', email: 'anita@example.com',     role: 'patient',       name: 'Anita Krishnan',  created: '2026-02-01', active: true },
];

const ORGS = [
  { id: 'org-001', name: 'Apollo General Hospital', city: 'Chennai', active: true,  patients: 124, created: '2026-01-01' },
  { id: 'org-002', name: 'AIIMS Medical Center',    city: 'Delhi',   active: true,  patients: 289, created: '2026-01-03' },
  { id: 'org-003', name: 'Fortis Healthcare',       city: 'Mumbai',  active: false, patients: 0,   created: '2026-01-10' },
];

const LOGS = [
  { id: 1, action: 'LOGIN',        user: 'admin@healthai.demo',   time: '2026-03-14 10:15', ip: '192.168.1.100', type: 'info' },
  { id: 2, action: 'PREDICTION',   user: 'patient@healthai.demo', time: '2026-03-14 09:45', ip: '192.168.1.101', type: 'success' },
  { id: 3, action: 'ROLE_CHANGE',  user: 'admin@healthai.demo',   time: '2026-03-13 16:30', ip: '192.168.1.100', type: 'warning' },
  { id: 4, action: 'REGISTER',     user: 'newuser@example.com',   time: '2026-03-13 14:00', ip: '192.168.1.105', type: 'info' },
  { id: 5, action: 'LOGIN_FAILED', user: 'unknown@example.com',   time: '2026-03-13 12:00', ip: '10.0.0.1',      type: 'danger' },
  { id: 6, action: 'ORG_CREATED',  user: 'admin@healthai.demo',   time: '2026-03-12 11:00', ip: '192.168.1.100', type: 'success' },
  { id: 7, action: 'USER_DISABLED',user: 'admin@healthai.demo',   time: '2026-03-11 09:00', ip: '192.168.1.100', type: 'warning' },
];

interface Props { onLogout: () => void; }

export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<'overview' | 'users' | 'hospitals' | 'logs' | 'analytics'>('overview');
  const [users, setUsers] = useState(USERS);
  const [orgs, setOrgs] = useState(ORGS);

  const toggleUser = (id: string) => setUsers(u => u.map(x => x.id === id ? { ...x, active: !x.active } : x));
  const toggleOrg  = (id: string) => setOrgs(o => o.map(x => x.id === id ? { ...x, active: !x.active } : x));

  const navItems = [
    { id: 'overview',   icon: '📊', label: 'Overview' },
    { id: 'users',      icon: '👥', label: 'Users' },
    { id: 'hospitals',  icon: '🏥', label: 'Hospitals' },
    { id: 'logs',       icon: '📋', label: 'Audit Logs' },
    { id: 'analytics',  icon: '📈', label: 'Analytics' },
  ];

  const logColors: Record<string, string> = { info: '#60a5fa', success: '#4ade80', warning: '#fbbf24', danger: '#f87171' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '220px', minHeight: '100vh', padding: '20px 14px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0, borderRight: '1px solid rgba(168,85,247,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '0 6px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7e22ce, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚙️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#faf5ff' }}>HealthAI</div>
            <div style={{ fontSize: '9px', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.08em' }}>ADMIN PANEL</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id as any)} className={`sidebar-link ${tab === item.id ? 'active' : ''}`}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
          <div style={{ padding: '0 6px', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Admin User</div>
            <span className="badge badge-admin" style={{ marginTop: '4px', display: 'inline-block', fontSize: '10px' }}>ADMIN</span>
          </div>
          <button onClick={onLogout} className="sidebar-link" style={{ color: '#f87171' }}>
            <span>🚪</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>System Overview</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>Platform-wide metrics and status — {new Date().toLocaleDateString()}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Users', value: '1,247', icon: '👥', color: '#c084fc' },
                { label: 'Organizations', value: '12', icon: '🏥', color: '#4ade80' },
                { label: 'Total Predictions', value: '8,432', icon: '🧠', color: '#60a5fa' },
                { label: 'Predictions Today', value: '127', icon: '📊', color: '#fbbf24' },
                { label: 'Model Accuracy', value: '94.7%', icon: '🎯', color: '#34d399' },
                { label: 'High Risk Today', value: '18', icon: '🚨', color: '#f87171' },
              ].map(m => (
                <div key={m.label} className="glass-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{m.icon}</span>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>System Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { name: 'FastAPI Backend', status: 'Operational', port: ':8000' },
                  { name: 'Patient App', status: 'Running', port: ':3000' },
                  { name: 'Hospital App', status: 'Running', port: ':3001' },
                  { name: 'Admin Panel', status: 'Running', port: ':3002' },
                  { name: 'ML Model', status: 'Loaded', port: 'v1.0.0' },
                  { name: 'Supabase', status: 'Demo Mode', port: 'Cloud' },
                ].map(s => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{s.port}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>User Management</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Manage all registered users and their roles</p>
            <div className="glass-card">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: '#94a3b8' }}>{u.email}</td>
                      <td><span className={`badge badge-${u.role === 'organization' ? 'org' : u.role}`}>{u.role}</span></td>
                      <td style={{ color: '#64748b' }}>{u.created}</td>
                      <td><span className={`badge badge-${u.active ? 'active' : 'inactive'}`}>{u.active ? 'Active' : 'Disabled'}</span></td>
                      <td>
                        <button className="btn-danger" onClick={() => toggleUser(u.id)} style={{ fontSize: '11px', padding: '4px 10px' }}>
                          {u.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOSPITALS */}
        {tab === 'hospitals' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Hospital Management</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Manage registered healthcare organizations</p>
            <div className="glass-card">
              <table>
                <thead>
                  <tr><th>Organization</th><th>City</th><th>Patients</th><th>Created</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {orgs.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>{o.name}</td>
                      <td style={{ color: '#94a3b8' }}>{o.city}</td>
                      <td style={{ color: '#c084fc', fontWeight: 700 }}>{o.patients}</td>
                      <td style={{ color: '#64748b' }}>{o.created}</td>
                      <td><span className={`badge badge-${o.active ? 'active' : 'inactive'}`}>{o.active ? 'Active' : 'Disabled'}</span></td>
                      <td>
                        <button className="btn-danger" onClick={() => toggleOrg(o.id)} style={{ fontSize: '11px', padding: '4px 10px' }}>
                          {o.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AUDIT LOGS */}
        {tab === 'logs' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Audit Logs</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>System-wide event history and security log</p>
            <div className="glass-card">
              <table>
                <thead>
                  <tr><th>Time</th><th>Action</th><th>User</th><th>IP Address</th><th>Type</th></tr>
                </thead>
                <tbody>
                  {LOGS.map(log => (
                    <tr key={log.id}>
                      <td style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{log.time}</td>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '12px', color: logColors[log.type] }}>{log.action}</td>
                      <td style={{ color: '#94a3b8', fontSize: '13px' }}>{log.user}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>{log.ip}</td>
                      <td>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, background: `${logColors[log.type]}18`, color: logColors[log.type], border: `1px solid ${logColors[log.type]}33` }}>
                          {log.type.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Platform Analytics</h1>
            <p style={{ color: '#64748b', marginBottom: '28px' }}>System-wide prediction trends and metrics</p>

            <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>📈 Weekly Prediction Volume</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '140px' }}>
                {[
                  { week: 'W1', count: 1200 }, { week: 'W2', count: 1450 }, { week: 'W3', count: 1380 },
                  { week: 'W4', count: 1690 }, { week: 'W5', count: 1920 }, { week: 'W6', count: 1792 },
                ].map((d, i) => {
                  const max = 1920;
                  const pct = (d.count / max) * 100;
                  return (
                    <div key={d.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700 }}>{d.count.toLocaleString()}</span>
                      <div style={{ width: '100%', height: `${pct * 1.1}px`, background: i === 5 ? 'linear-gradient(180deg, #a855f7, #7e22ce)' : 'rgba(168,85,247,0.25)', borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease' }} />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{d.week}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>User Distribution</h3>
                {[
                  { role: 'Patients', count: 1089, color: '#60a5fa' },
                  { role: 'Hospital Staff', count: 146, color: '#4ade80' },
                  { role: 'Admins', count: 12, color: '#c084fc' },
                ].map(r => (
                  <div key={r.role} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{r.role}</span>
                      <span style={{ fontWeight: 700, color: r.color }}>{r.count}</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '3px', background: r.color, width: `${(r.count / 1247) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Top Diseases (Platform)</h3>
                {[
                  { disease: 'Influenza', count: 2841 }, { disease: 'Common Cold', count: 2107 },
                  { disease: 'Hypertension', count: 1654 }, { disease: 'Dengue Fever', count: 892 },
                  { disease: 'Diabetes', count: 724 },
                ].map((d, i) => (
                  <div key={d.disease} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '20px', fontSize: '11px', color: '#c084fc', fontWeight: 700 }}>#{i+1}</span>
                      <span style={{ fontSize: '13px' }}>{d.disease}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#c084fc', fontSize: '13px' }}>{d.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
