import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import './login.css';
import { GoogleSignInButton } from './components/googleSignInButton';


export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="login_box">
          <div className="login-header">
            <span>Login</span>
          </div>

          <div className="input_box">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="input_box">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>
          </div>

          <div className="input_box">
              <button onClick={handleEmailLogin}>Login</button>
              <button onClick={handleRegister}>Register</button>
              <hr />
              <GoogleSignInButton onClick={handleGoogleLogin}/>
              {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

      </div>
      
    </div>
  );
}
