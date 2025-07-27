import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import './Home.css'

const Home = () => {
    const user = useSelector(state => state.session.user);

    if (user) return <Navigate to="/dashboard" />;

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="hero-container">
                    <div className="hero-left">
                        <h1>Split bills, not friendships.</h1>
                        <p className="tagline">
                            Why save money when you can split a $12 smoothie 17 ways?
                            Join now and make debt... social.
                        </p>
                        <OpenModalButton 
                            className="sign-up-button"
                            buttonText="Sign Up!"
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                    <div className="hero-right">
                        <img
                            src="https://i.imgur.com/FrVa2vs.jpeg"
                            alt="Friends splitting chaos"
                            className="home-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
