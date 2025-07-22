import './Home.css'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import SignupFormModal from '../SignupFormModal/SignupFormModal'

const Home = () => {


    return (
    <div className="home-container">
        <div className="home-content">
            <div className="hero-container">
                {/* <div> */}
                <div className="hero-left">
                <p><h3>The #1 app to win (or lose) a ton of money.</h3>
                    Because what’s financial stability when you can split brunch 17 ways?
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