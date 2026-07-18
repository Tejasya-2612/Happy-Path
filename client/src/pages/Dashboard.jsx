import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { api } from '../services/api.js';

export function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, available: 0, borrowed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const [allTools, availableTools, borrowedTools] = await Promise.all([
          api.get('/tools?limit=1'),
          api.get('/tools?limit=1&availability=Available'),
          api.get('/tools?limit=1&availability=Borrowed')
        ]);
        if (!active) return;
        setSummary({
          total: allTools.data.pagination.total,
          available: availableTools.data.pagination.total,
          borrowed: borrowedTools.data.pagination.total
        });
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Unable to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page-section" aria-labelledby="dashboard-title">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2 id="dashboard-title">Library overview</h2>
        </div>
        <Link className="button" to="/dashboard/tools/new">
          Add Tool
        </Link>
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <Spinner label="Loading dashboard" />
      ) : (
        <div className="metric-grid">
          <article className="metric-card">
            <span>Total Tools</span>
            <strong>{summary.total}</strong>
          </article>
          <article className="metric-card">
            <span>Available</span>
            <strong>{summary.available}</strong>
          </article>
          <article className="metric-card">
            <span>Borrowed</span>
            <strong>{summary.borrowed}</strong>
          </article>
        </div>
      )}
    </section>
  );
}
