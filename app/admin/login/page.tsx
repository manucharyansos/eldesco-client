'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/cms';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@eldesco.am');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminApi.login(email, password);
      router.replace('/admin/dashboard');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__visual">
        <div className="admin-login__grid" />
        <div className="admin-login__copy">
          <span className="eyebrow">ELDESCO / CMS</span>
          <h1>One place for the entire website.</h1>
          <p>Pages, multilingual text, images, navigation and company information are managed from this panel.</p>
        </div>
      </div>
      <div className="admin-login__form-wrap">
        <form className="admin-login__form" onSubmit={submit}>
          <div><span className="admin-login__logo">E</span><strong>ELDESCO</strong></div>
          <h2>Administrator sign in</h2>
          <p>Use the credentials configured in the Laravel environment.</p>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
          {error && <div className="admin-alert admin-alert--error">{error}</div>}
          <button className="admin-button admin-button--primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </main>
  );
}
