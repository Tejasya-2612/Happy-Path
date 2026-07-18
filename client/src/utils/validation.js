export function validateTool(values) {
  const errors = {};

  if (values.toolName.trim().length < 2) errors.toolName = 'Tool name must be at least 2 characters.';
  if (values.category.trim().length < 2) errors.category = 'Category must be at least 2 characters.';
  if (values.brand.trim().length < 2) errors.brand = 'Brand must be at least 2 characters.';
  if (!values.condition) errors.condition = 'Choose a condition.';
  if (!values.availability) errors.availability = 'Choose availability.';
  if (Number(values.quantity) < 0 || values.quantity === '') errors.quantity = 'Quantity must be zero or more.';

  if (values.returnDate && values.borrowDate && values.returnDate < values.borrowDate) {
    errors.returnDate = 'Return date cannot be before borrow date.';
  }

  return errors;
}

export function validateAuth(values, mode) {
  const errors = {};

  if (mode === 'register' && values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}
