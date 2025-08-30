import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="header header--frosted">
      <div className="logo">
        <span className="logo__stack">
          <span className="logo__word">ASYNC</span>
          <span className="logo__word logo__word--accent">RACE</span>
        </span>
        <span className="logo__glow" aria-hidden="true" />
      </div>

      <nav className="header__nav">
        <NavLink to="/garage" className={`btn nav ${pathname === '/garage' ? 'active' : ''}`}>
          GARAGE
        </NavLink>
        <NavLink to="/winners" className={`btn nav ${pathname === '/winners' ? 'active' : ''}`}>
          WINNERS
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
