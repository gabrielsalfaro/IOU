import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  return (
    <div className="nav-container">
      <ul className="nav-content">

        <li className="nav-home">
          
          {/* Home link changes if authenticated */}
          <NavLink to={sessionUser ? "/dashboard" : "/"}>
            <b>ExpenseApp</b>
          </NavLink>
        </li>

        <li className="nav-spacer"></li>
        {/* {isLoaded && sessionUser && (
          <>
            <li className="nav-profile">
              <ProfileButton user={sessionUser} />
            </li>
          </>
        )} */}

        {/* {isLoaded && !sessionUser && ( */}
          <li className="nav-profile">
            <ProfileButton user={sessionUser} />
          </li>
        {/* )} */}
        
      </ul>
    </div>
    
  );
}

export default Navigation;
