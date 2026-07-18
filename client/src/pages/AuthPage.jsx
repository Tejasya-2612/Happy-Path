import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { validateAuth } from '../utils/validation.js';

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { loading, error, setError, run } = useAsync();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const isRegister = mode === 'register';

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateAuth(values, mode);
    setErrors(nextErrors);
    setError('');

    if (Object.keys(nextErrors).length > 0) return;

    await run(async () => {
      if (isRegister) {
        await register(values);
      } else {
        await login({ email: values.email, password: values.password });
      }

      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    });
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Happy Path</p>
        <h1 id="auth-title">{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <AuthField label="Name" name="name" value={values.name} error={errors.name} onChange={updateField} />
          )}
          <AuthField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={updateField} />
          <AuthField label="Password" name="password" type="password" value={values.password} error={errors.password} onChange={updateField} />
          <button type="submit" className="button button-full" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        {loading && <Spinner label="Authenticating" />}
        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </section>
    </main>
  );
}

function AuthField({ label, name, error, ...props }) {
  const errorId = `${name}-error`;

  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
      {error && <small id={errorId}>{error}</small>}
    </label>
  );
}
