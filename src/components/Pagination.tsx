type Props = { page: number; total: number; limit: number; onChange: (p: number) => void };
const Pagination = ({ page, total, limit, onChange }: Props) => {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="pagination">
      <button
        className="btn small"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        type="button"
      >
        ‹
      </button>
      <span>{`PAGE #${page}`}</span>
      <button
        className="btn small"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        type="button"
      >
        ›
      </button>
    </div>
  );
};
export default Pagination;
