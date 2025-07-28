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
            <img
              // src="https://i.imgur.com/0V54BM4.png"
              src="/IOU_Logo.png"
              alt="IOU logo"
              className="nav-logo"
            />
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

        {sessionUser && (
          <li>
            <div className="nav-user-container">
              {/* <NavLink to={`/users/${sessionUser.id}`} > */}
                <div className="nav-user-img">
                  {/* {sessionUser.profile_img} */}
                </div>
                <div className="nav-user-name">
                  {sessionUser.firstname} {' '}
                  {sessionUser.lastname}
                </div>
              {/* </NavLink> */}
            </div>
          </li>
        )}

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
