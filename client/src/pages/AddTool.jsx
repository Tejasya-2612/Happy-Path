import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { ToolForm } from '../components/ToolForm.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { api } from '../services/api.js';
import { logCrudInteraction } from '../utils/analytics.js';

export function AddTool() {
  const navigate = useNavigate();
  const { loading, error, run } = useAsync();

  async function handleSubmit(values) {
    await run(async () => {
      await api.post('/tools', values);
      logCrudInteraction();
      navigate('/dashboard/tools');
    });
  }

  return (
    <section className="page-section" aria-labelledby="add-title">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 id="add-title">Add tool</h2>
        </div>
      </div>
      <Alert>{error}</Alert>
      <ToolForm submitting={loading} onSubmit={handleSubmit} submitLabel="Create Tool" />
    </section>
  );
}
