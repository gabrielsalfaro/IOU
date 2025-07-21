import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <div className="nav-container">
      <ul className="nav-content">
        <li className="nav-home">
          <NavLink to="/"><b>ExpenseApp</b></NavLink>
        </li>

        <li className="nav-spacer"></li>

        <li className="nav-profile">
          <ProfileButton />
        </li>
      </ul>
    </div>
    
  );
}

export default Navigation;
