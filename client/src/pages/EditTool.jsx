import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { ToolForm } from '../components/ToolForm.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { api } from '../services/api.js';
import { logCrudInteraction } from '../utils/analytics.js';

export function EditTool() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, run } = useAsync();
  const [tool, setTool] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadTool() {
      try {
        const { data } = await api.get(`/tools/${id}`);
        if (active) setTool(data.tool);
      } catch (err) {
        if (active) setFetchError(err.response?.data?.message || 'Unable to load tool');
      } finally {
        if (active) setFetching(false);
      }
    }

    loadTool();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(values) {
    await run(async () => {
      await api.put(`/tools/${id}`, values);
      logCrudInteraction();
      navigate('/dashboard/tools');
    });
  }

  return (
    <section className="page-section" aria-labelledby="edit-title">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 id="edit-title">Edit tool</h2>
        </div>
      </div>
      <Alert>{fetchError || error}</Alert>
      {fetching ? (
        <Spinner label="Loading tool" />
      ) : tool ? (
        <ToolForm key={tool._id} tool={tool} submitting={loading} onSubmit={handleSubmit} submitLabel="Update Tool" />
      ) : (
        <div className="empty-state">No data found</div>
      )}
    </section>
  );
}
