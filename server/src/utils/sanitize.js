const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

export function sanitizeText(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().replace(/[&<>"'/]/g, (char) => entityMap[char]);
}

export function sanitizeObject(payload, fields) {
  return fields.reduce((clean, field) => {
    if (payload[field] !== undefined) {
      clean[field] = sanitizeText(payload[field]);
    }
    return clean;
  }, {});
}
