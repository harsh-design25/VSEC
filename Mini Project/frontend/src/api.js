async function request(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.errors?.length ? data.errors.map(e => e.message).join('. ') : data.message;
    throw new Error(msg || 'Something went wrong');
  }
  return data;
}

export const api = {
  get: p => request(p),
  post: (p, b) => request(p, 'POST', b),
  put: (p, b) => request(p, 'PUT', b),
  del: p => request(p, 'DELETE'),
};
