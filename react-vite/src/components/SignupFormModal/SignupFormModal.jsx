import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  // const [usernameMessage, setUsernameMessage] = useState();
  const [passwordMessage, setPasswordMessage] = useState();

  // give me demo data
  const generateRandomString = (length = 3) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  const handleDemoSignup = () => {
    const random = generateRandomString();
    const demoEmail = `email_${random}@demo.io`;
    const demoUsername = `demo_${random}`;

    setEmail(demoEmail);
    setUsername(demoUsername);
    setFirstName(`Demo_${random}`);
    setLastName(`User`);
    setPassword("password");
    setConfirmPassword("password");
    setPasswordMessage('( password: password )')
    // setUsernameMessage(`( username: ${demoUsername} )`)

    setErrors({});
  };

  // email regex
  const emailRegex = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

  // name regex, no numbers in names
  const firstNameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
  const lastNameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;


  const emptyFields = (
    !email.trim() ||
    // !emailRegex.test(email) ||
    !username.trim() || (username.trim().length < 4) ||
    !firstname.trim() ||
    !lastname.trim() ||
    !password.trim() || (password.trim().length < 6) ||
    !confirmPassword.trim()
  )

  // if (!emailRegex.test(email)) {
  //   return setErrors({ email: "Please enter a valid email address" });
  // }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      return setErrors({ email: "Please enter a valid email address" });
    }

    if (!firstNameRegex.test(firstname)) {
      return setErrors({ firstname: "First name must contain only letters" });
    }
    
    if (!lastNameRegex.test(lastname)) {
      return setErrors({ lastname: "Last name must contain only letters" });
    }

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Password does not match",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        firstname,
        lastname,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="modal-container" onClick={() => closeModal()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="modal-title">Sign Up</h1>

        <center>
          <button 
            style={{padding: '10px 0', justifyContent: 'center'}}
            type="button" 
            className="demo-fill-button"
            onClick={handleDemoSignup}>
            Demo Fill Data
          </button>
        </center>

        <form onSubmit={handleSubmit} className="login-form">
          {/* {errors.credential && <p className="error-message">{errors.credential}</p>} */}
          <label>
            <div className="signup-label-title">Email
              {errors.email && <span className="error-message"> {' '}{errors.email}</span>}
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          

          <label>
            <div className="signup-label-title">Username
              {errors.username && <span className="error-message"> {' '}{errors.username}</span>}
            </div>

          {/* {usernameMessage && 
            <span 
              style={{padding: '5px 0', color: 'gray'}} 
              className="demo-message">
                {' '}
                {usernameMessage}
            </span>} */}

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          
          
          <label>
            <div className="signup-label-title">First Name
              {errors.firstname && <span className="error-message">{' '} {errors.firstname}</span>}
            </div>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          
          
          <label>
            <div className="signup-label-title">Last Name
              {errors.lastname && <span className="error-message">{' '}{errors.lastname}</span>}
            </div>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          

          <label>
            <div className="signup-label-title">Password
              {errors.password && <span className="error-message">{' '}{errors.password}</span>}
            </div>
            
          {passwordMessage && 
          <span 
            style={{padding: '5px 0', color: 'gray'}} 
            className="demo-message">
              {' '}
              {passwordMessage}
          </span>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          

          <label>
            <div className="signup-label-title">Confirm Password
              {errors.confirmPassword && <span className="error-message">{' '} {errors.confirmPassword}</span>}
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          

          <center>
            <button 
            disabled={emptyFields}
            type="submit" 
            className="login-button">
              Sign Up
            </button>
          </center>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
