import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import LeftPanel from "../components/PanelLeft/LeftPanel";
import RightPanel from "../components/PanelRight/RightPanel";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const location = useLocation();

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const isHome = location.pathname === "/";
  const showLeftPanel = sessionUser && !isHome;

  return (
    <>
      <ModalProvider>
        <Navigation />
        {/* {isLoaded && <Outlet />} */}

        {isLoaded && (
        <div className="main-body">
          {showLeftPanel && <LeftPanel />}

          {/* All Feature Components will render inside main-content div  */}
          <div className="main-content">
            <Outlet />
          </div>

          {showLeftPanel && <RightPanel />}
        </div>

      )}
        <Modal />
      </ModalProvider>
    </>
  );
}
