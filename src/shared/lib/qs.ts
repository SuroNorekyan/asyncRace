export const qs = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) search.set(k, String(v));
  });
  const s = search.toString();
  return s ? `?${s}` : '';
};

export default qs;
