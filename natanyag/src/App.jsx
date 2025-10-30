import { useState, useEffect } from "react";
import Login from "./login";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return <Login onLogin={()=>{}} />;

  console.log("user:", user);
  return (
    <div class="appEnterBox">
      <h1 class="welcomeMessage">Welcome, {user.email}</h1>
      <button class="logoutButton" onClick={handleLogout}>Logout</button>
      {
      <p>Firebase elindult!!!</p>     
      }
      <a href="/NATjegyzetek/6.oszt/irodalom/irodalom_6.html" class="appLink">Irodalom jegyzetek</a>
    </div>
  );
}

export default App;

