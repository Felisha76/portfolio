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
          <div class="welcomeMessage">
          <p class="welcomeText">Welcome, {user.email}</p>
          </div>
          <div class="logoutBox">
          <button class="logoutButton" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div class="mainContent">

               <div class="newsBox">
                    <div class="titleBox">
                      <p class="newsTitle">Hírek, újdonságok</p>
                    </div>
                    {/* template 
                    <div class="newsItem">
                      <label class="mainLabel">2025. november</label>
                        <p class="article">november 01.
                          <ol>
                            <li></li>
                            <li></li>
                            <li></li>
                          </ol>
                        </p>
                    </div>
                    */}

                    <div class="newsItem">
                      <label class="mainLabel">2025.</label>
                      {/* TEMPLATE
                      <p class="article">november 01.
                          <ol>
                            <li></li>
                          </ol>
                        </p>
                      <div class="divider-gradient"><p></p></div>
                      */}

                        <p class="article">november 01.
                          <ol>
                            <li>A Nat jegyzetek átköltöztek egy Firebase alapú webapplikációba.</li>
                          </ol>
                        </p>
                        <div class="divider-gradient"><p></p></div>
                        <p class="article">október 21.
                          <ol>
                            <li>Készen lett az összes hatodikos <b>történelem</b> jegyzet is.</li>
                            <li>Elkészült egy olyan <b>teszt sablon 📝</b> amivel egyszerűen 
                            készíthetünk feleletválasztós teszteket bármilyen témában.</li>
                            <li>A teszt beépítésre került a hatodikos irodalom jegyzetbe ✏️</li>
                          </ol>
                        </p>
                        <div class="divider-gradient"><p></p></div>
                        <p class="article">október 19.
                          <ol>
                            <li>A hatodikos <b>Természettudomány</b> jegyzetek készen vannak.</li>
                          </ol>
                        </p>
                        <div class="divider-gradient"><p></p></div>
                        <p class="article">október 14.
                          <ol>
                            <li>A hatodikos <b>Nyelvtan</b> jegyzetek készen vannak.</li>
                            <li>📖 Irodalomból ezek vannak már készen:
                                <ul>
                                  <li>Szent László és a kun vitéz küzdelme 8</li>
                                  <li>A tordai hasadék 12</li>
                                  <li>Arany János: Szent László (legenda) 14</li>
                                  <li>Csörsz árka 18</li>
                                  <li>Szimónidész: A thermopülei hősök sírfelirata 20</li>
                                  <li>Széchenyi Zsigmond: Csui!… (részlet) 22</li>
                                  <li>Kőmíves Kelemenné 25</li>
                                  <li>Arany János: Mátyás anyja 30</li>
                                  <li>Arany János: A walesi bárdok 35</li>
                                  <li>Fazekas Mihály: Lúdas Matyi – Első levonás 41</li>
                                  <li>Fazekas Mihály: Lúdas Matyi – Második levonás 45</li>
                                  <li>Fazekas Mihály: Lúdas Matyi – Harmadik levonás 51</li>
                                  <li>Fazekas Mihály: Lúdas Matyi – Negyedik levonás 55</li>
                                  <li>Összefoglalás – Hősök az irodalomban 60</li>
                                </ul>
                            </li>
                          </ol>
                        </p>
                        <div class="divider-gradient"><p></p></div>
                        <p class="article">október 13.
                          <ol>
                            <li>⚠️Nyelvtan: Új formátumú jegyzetek, és újabb fejezetek készültek el:
                              <ul>
                                  <li>🆕1–2. Ismétlés 7</li>
                                  <li>🆕3. Szövegértés, szövegalkotás a gyakorlatban 10</li>
                                  <li>🆕4. Az ismeretközlő szöveg beszédben és írásban 15</li>
                              </ul>
                                  I. SZÓFAJOK A MONDATBAN: főnév, melléknév, számnév; viszonyszók I.
                              <ul>
                                  <li>🆕5–6. A szófajok csoportjai 18</li>
                                  <li>🆕7. A főnév jelentése, toldalékolhatósága, mondatbeli szerepe 23</li>
                                  <li>🆕8. A főnév fajtái 26</li>
                                  <li>🆕9. A tulajdonnevek helyesírása I. 30</li>
                                  <li>🆕10. A tulajdonnevek helyesírása II. : A földrajzi nevek helyesírása 32</li>

                                  <li>🆕12. A viszonyszók I. Névelő, névutó, kötőszó, tagadószó 36</li>
                                  <li>🆕13. A melléknév 38</li>
                                  <li>🆕14. A tulajdonnévből képzett melléknevek helyesírása 41</li>

                                  <li>🆕18. A számnév 51</li>
                                  <li>🆕💥19. A számnév helyesírása és helyes használata 54</li>

                              </ul>
                            </li>
                          </ol>
                        </p>
                        <div class="divider-gradient"><p></p></div>
                        <p class="article">október 10.
                          <ol>
                            <li>⚠️ <b>Nyelvtan</b> kattintható EPUB tartalomjegyzék készen lett. 😊</li>
                            <li>⚠️<b>NYELVTAN:</b> Ma a jegyzetekkel végeztem 'A tulajdonnévből képzett melléknevek helyesírása' 
                                fejezetig, vagyis az első témacsoport a témazáróig már készen van ebből. </li> 
                            <li>⚜️ <b>TÖRTÉNELEM</b>-ből a Hunyadi János a törökverő fejezet is készen van, 
                                és a jegyzetet, a tankönyvet, a munkafüzetet és az atlaszt is meg tudjátok
                                nyitni akár mobilról is.  </li>
                            <li>📖 <b>IRODALOM</b>-ból Arany János: A walesi bárdok és az ezt megelőző leckék 
                                kijegyzetelése készen van, azt hiszem, nagyjából itt tartanak most a gyerkek 
                                az iskolában. Szintén meg lehet nyitni az EPUB munkafüzetet is alul. </li> 
                            <li>🌿 <b>TERMÉSZETTUDOMÁNY</b>-ból a jegyzetekkel ma nem haladtam, de látom, 
                                hogy párhuzamosan tanulják a földrajzi és biológiai témákat ❤ 
                                Igyekszem majd ehhez alkalmazkodni. </li>
                          </ol>
                        </p>
                                               
                    </div>

                </div>  

               <div class="natJegyzetBox">  
                  <div class="titleBox">
                    <p class="title">NAT jegyzetek</p>
                  </div>
                  
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

        <div class="footer">
          <p class="article">NATanyag&copy; Version: 1.5 2025.11.02 </p>
          <a href="mailto:frontneststudio@gmail.com" class="appLink"><b>Contact:📧 frontneststudio@gmail.com</b></a>
        </div>    
    </div>
  );
}

export default App;

