import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { api } from '../services/api.js';
import { logCrudInteraction } from '../utils/analytics.js';

const defaultFilters = {
  search: '',
  category: '',
  availability: '',
  sortBy: 'date',
  direction: 'desc',
  page: 1
};

export function ToolList() {
  const [filters, setFilters] = useState(defaultFilters);
  const [tools, setTools] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadTools() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/tools', {
          signal: controller.signal,
          params: { ...filters, limit: 8 }
        });
        setTools(data.tools);
        setPagination(data.pagination);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || 'Unable to load tools');
        }
      } finally {
        setLoading(false);
      }
    }

    loadTools();
    return () => controller.abort();
  }, [filters]);

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  async function handleDelete(toolId) {
    const confirmed = window.confirm('Delete this tool? This action cannot be undone.');
    if (!confirmed) return;

    setError('');
    try {
      await api.delete(`/tools/${toolId}`);
      logCrudInteraction();
      setFilters((current) => ({ ...current }));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete tool');
    }
  }

  return (
    <section className="page-section" aria-labelledby="tools-title">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 id="tools-title">Tools</h2>
        </div>
        <Link className="button" to="/dashboard/tools/new">
          Add Tool
        </Link>
      </div>
      <div className="toolbar" aria-label="Tool search and filters">
        <input name="search" value={filters.search} onChange={updateFilter} placeholder="Search by tool name" aria-label="Search by tool name" />
        <input name="category" value={filters.category} onChange={updateFilter} placeholder="Search by category" aria-label="Search by category" />
        <select name="availability" value={filters.availability} onChange={updateFilter} aria-label="Filter by availability">
          <option value="">All availability</option>
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        <select name="sortBy" value={filters.sortBy} onChange={updateFilter} aria-label="Sort tools">
          <option value="date">Sort by date</option>
          <option value="name">Sort by name</option>
        </select>
        <select name="direction" value={filters.direction} onChange={updateFilter} aria-label="Sort direction">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <Spinner label="Loading tools" />
      ) : tools.length === 0 ? (
        <div className="empty-state">No data found</div>
      ) : (
        <>
          <div className="tool-grid">
            {tools.map((tool) => (
              <article className="tool-card" key={tool._id}>
                <div>
                  <h3>{tool.toolName}</h3>
                  <p>
                    {tool.category} / {tool.brand}
                  </p>
                </div>
                <dl>
                  <div>
                    <dt>Condition</dt>
                    <dd>{tool.condition}</dd>
                  </div>
                  <div>
                    <dt>Quantity</dt>
                    <dd>{tool.quantity}</dd>
                  </div>
                  <div>
                    <dt>Availability</dt>
                    <dd>{tool.availability}</dd>
                  </div>
                  <div>
                    <dt>Borrower</dt>
                    <dd>{tool.borrowerName || 'None'}</dd>
                  </div>
                </dl>
                <p className="notes">{tool.notes || 'No notes'}</p>
                <div className="card-actions">
                  <Link className="button button-secondary" to={`/dashboard/tools/${tool._id}/edit`}>
                    Edit
                  </Link>
                  <button type="button" className="button button-danger" onClick={() => handleDelete(tool._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="pagination" aria-label="Pagination">
            <button
              type="button"
              className="button button-secondary"
              disabled={pagination.page <= 1}
              onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              type="button"
              className="button button-secondary"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
