import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import './Home.css'


const Home = () => {
    const user = useSelector(state => state.session.user);

    // navigate to dashboard if authenticated
    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
    <div className="home-container">
        <div className="home-content">
            <div className="hero-container">
                {/* <div> */}
                <div className="hero-left">
                    <h3>The #1 app to win (or lose) a ton of money.</h3>
                    <p>Because what’s financial stability when you can split brunch 17 ways?
                    Join now and pretend budgeting is fun.</p>

                <OpenModalButton 
                    className="sign-up-button"
                    buttonText="Sign Up!"
                    modalComponent={<SignupFormModal />}
                />
                </div>
                <div className="hero-right">
                    <img src="https://i.imgur.com/FrVa2vs.jpeg" alt="" className='home-image' />
                </div>
                {/* </div> */}
                {/* <OpenModalButton 
                    className="sign-up-button"
                    buttonText="Sign Up!"
                    modalComponent={<SignupFormModal />}
                /> */}
            </div>
            <div className="footer">

            </div>
        </div>
    </div>
    )
}

export default Home