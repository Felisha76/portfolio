import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import './login.css';
import GoogleSignInButton from './components/googleSignInButton/GoogleSignInButton';
import { sendPasswordResetEmail } from "firebase/auth";


export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Add meg az email címed!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Jelszó-visszaállító email elküldve! (Kérlek, ellenőrizd a spam mappát is az email fiókodban!)");
    } catch (err) {
      setError(err.message);
    }
  };

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
    <div class="mainBox">
      <div className="wrapper">
        <div className="login_box">
            <div className="login-header">
              <span>Login</span>
            </div>

            <div className="input_box_email">
              <input class="login_input_email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input  class="login_input_email" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <div className="remember-forgot">
              <div className="remember-me">
                <input class="remember_input" type="checkbox" id="remember" />
                <label class="remember_label" htmlFor="remember"> Remember me</label>
              </div>

              
                <a href="#" class="login_a" onClick={handleForgotPassword}>Forgot password?</a>
              
            </div>

            <div className="input_box_loginButtons">
                <button class="login_button" onClick={handleEmailLogin}>Login</button>
                <button class="login_button" onClick={handleRegister}>Register</button>
                
                <GoogleSignInButton class="googleButton" onClick={handleGoogleLogin}/>
                {error && <p style={{ color: "white" }}>{error}</p>}
            </div>

        </div>
        
      </div>
    </div>
  );
}
