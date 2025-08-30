import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h2>404 — No such page</h2>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <button type="button" className="btn" onClick={() => navigate('/')} title="Go to garage">
        ⬅ Back to Garage
      </button>
    </div>
  );
};

export default NotFound;
