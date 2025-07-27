import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
// import * as thunkLogin from '../../redux/session';

function LoginFormModal({ onLoginSuccess }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleDemoLogin = () => {
    return dispatch(thunkLogin({
      email: 'demo@aa.io',
      password: 'password'
    }))
      .then(() => {
        closeModal();
        if (onLoginSuccess) onLoginSuccess(); 
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };


  return (
    <div className="modal-container" onClick={() => closeModal()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="modal-title">Log In</h1>
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
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <center><button type="submit" className="login-button">Log In</button></center>

          <div className="demo-user-container">
            <a href="#" className="demo-user" onClick={(e) => {
              e.preventDefault();
              handleDemoLogin();
              }}>
              <center>Demo User</center>
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LoginFormModal;
