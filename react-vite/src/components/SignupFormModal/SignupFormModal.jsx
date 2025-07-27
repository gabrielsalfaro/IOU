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
  const [usernameMessage, setUsernameMessage] = useState();
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
    setUsernameMessage(`( username: ${demoUsername} )`)

    setErrors({});
  };

  const emptyFields = (
    !email.trim() ||
    !username.trim() || (username.trim().length < 4) ||
    !firstname.trim() ||
    !lastname.trim() ||
    !password.trim() || (password.trim().length < 6) ||
    !confirmPassword.trim()
  )

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
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
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
          {usernameMessage && <p style={{padding: '5px 0', color: 'gray'}} className="demo-message">{usernameMessage}</p>}
          
          <label>
            First Name
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstname && <p>{errors.firstname}</p>}
          
          <label>
            Last Name
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastname && <p>{errors.lastname}</p>}

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          {passwordMessage && <p style={{padding: '5px 0', color: 'gray'}} className="demo-message">{passwordMessage}</p>}

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

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
