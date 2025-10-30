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
        <div class="headerBox">
          <h1 class="welcomeMessage">Welcome, {user.email}</h1>
          <button class="logoutButton" onClick={handleLogout}>Logout</button>
        </div>

        <div class="mainContent">
          <div class="natJegyzetek">
            <label class="mainLabel">3. osztály</label>
          </div>

          <div class="natJegyzetek">
            <label class="mainLabel">4. osztály</label>
          </div>

          <div class="natJegyzetek">
            <label class="mainLabel">5. osztály</label>
          </div>

          <div class="natJegyzetek">
            <label class="mainLabel">6. osztály</label>
            <a href="/NATjegyzetek/6_oszt/irodalom/irodalom_6.html" class="appLink">Irodalom</a>
            <a href="/NATjegyzetek/6_oszt/nyelvtan/nyelvtan_6.html" class="appLink">Nyelvtan</a>
            <a href="/NATjegyzetek/6_oszt/tortenelem/tortenelem_6.html" class="appLink">Történelem</a>
            <a href="/NATjegyzetek/6_oszt/termeszettudomany/termeszettudomany_6.html" class="appLink">Természettudomány</a>
          </div>

          <div class="natJegyzetek">
            <label class="mainLabel">7. osztály</label>
          </div>
          
          <div class="natJegyzetek">
            <label class="mainLabel">8. osztály</label>
          </div>
        </div>
            
    </div>
  );
}

export default App;

