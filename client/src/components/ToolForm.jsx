import { useMemo, useState } from 'react';
import { validateTool } from '../utils/validation.js';

const initialValues = {
  toolName: '',
  category: '',
  brand: '',
  condition: 'Good',
  quantity: 1,
  availability: 'Available',
  borrowerName: '',
  borrowDate: '',
  returnDate: '',
  notes: ''
};

function dateForInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

export function ToolForm({ tool, submitting, onSubmit, submitLabel }) {
  const defaults = useMemo(
    () =>
      tool
        ? {
            toolName: tool.toolName || '',
            category: tool.category || '',
            brand: tool.brand || '',
            condition: tool.condition || 'Good',
            quantity: tool.quantity ?? 1,
            availability: tool.availability || 'Available',
            borrowerName: tool.borrowerName || '',
            borrowDate: dateForInput(tool.borrowDate),
            returnDate: dateForInput(tool.returnDate),
            notes: tool.notes || ''
          }
        : initialValues,
    [tool]
  );

  const [values, setValues] = useState(defaults);
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTool(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(values);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <Field label="Tool Name" name="toolName" value={values.toolName} error={errors.toolName} onChange={updateField} />
      <Field label="Category" name="category" value={values.category} error={errors.category} onChange={updateField} />
      <Field label="Brand" name="brand" value={values.brand} error={errors.brand} onChange={updateField} />
      <label className="field">
        <span>Condition</span>
        <select name="condition" value={values.condition} onChange={updateField} aria-invalid={Boolean(errors.condition)}>
          <option>New</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Needs Repair</option>
        </select>
        {errors.condition && <small>{errors.condition}</small>}
      </label>
      <Field label="Quantity" name="quantity" type="number" min="0" value={values.quantity} error={errors.quantity} onChange={updateField} />
      <label className="field">
        <span>Availability</span>
        <select name="availability" value={values.availability} onChange={updateField} aria-invalid={Boolean(errors.availability)}>
          <option>Available</option>
          <option>Borrowed</option>
          <option>Unavailable</option>
        </select>
        {errors.availability && <small>{errors.availability}</small>}
      </label>
      <Field label="Borrower Name" name="borrowerName" value={values.borrowerName} error={errors.borrowerName} onChange={updateField} />
      <Field label="Borrow Date" name="borrowDate" type="date" value={values.borrowDate} error={errors.borrowDate} onChange={updateField} />
      <Field label="Return Date" name="returnDate" type="date" value={values.returnDate} error={errors.returnDate} onChange={updateField} />
      <label className="field field-wide">
        <span>Notes</span>
        <textarea name="notes" value={values.notes} onChange={updateField} rows="4" aria-invalid={Boolean(errors.notes)} />
        {errors.notes && <small>{errors.notes}</small>}
      </label>
      <div className="form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, error, ...props }) {
  const errorId = `${name}-error`;

  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
      {error && <small id={errorId}>{error}</small>}
    </label>
  );
}
