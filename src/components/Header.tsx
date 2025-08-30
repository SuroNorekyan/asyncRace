import { NavLink } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <nav className="nav">
      <NavLink className="nav__link" to="/garage">
        Garage
      </NavLink>
      <NavLink className="nav__link" to="/winners">
        Winners
      </NavLink>
    </nav>
  </header>
);

export default Header;
