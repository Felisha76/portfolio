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
                      <label class="mainLabel">2025. november</label>
                        <p class="article">november 01.
                          <ol>
                            <li>A Nat jegyzetek átköltöztek egy Firebase alapú webapplikációba.</li>
                          </ol>
                        </p>
                    </div>

                    <div class="newsItem">
                      <label class="mainLabel">2025. október</label>
                      <p class="article">október 21.
                        <ol>
                          <li>Készen lett az összes hatodikos <b class="highlight">történelem</b> jegyzet is.</li>
                          <li>Elkészült egy olyan <b class="highlight">teszt sablon</b> amivel egyszerűen 
                              készíthetünk feleletválasztós teszteket bármilyen témában. </li>   
                          <li>A 6-os irodalom jegyzetekbe ez a teszt beépítésre került ✏️</li>
                        </ol>  
                        <ul>
                          <li>A jobb oldali menüben találjátok ezeket ➡️ </li>                         
                        </ul>
                      </p>
                      
                      <div class="divider-gradient"></div>
                      
                      <p class="article">október 19.
                          <ol>
                            <li>A hatodikos <b>Természettudomány</b> jegyzetek készen vannak. </li>
                            <li>A <b class="highlight">nyelvtanulási segéletekből</b>  a Die Deutschprofis A1 és A2 most már fejezetenkénti bontásban is 
                                megtalálható a <b>Szótanuló flipcard-okban</b>, és a <b>Word Test</b>applikációkban. (Ezek átköltöztetése a webapplikációba
                                még folyamatban van, a régi oldalon találjátok.)
                            </li>
                            <li>A <b class="highlight">flipcardokról</b> levettem a generált pötty képeket, többen jeleztétek, hogy mobilon zavaróak. 
                                Sajnos nem tudom visszatenni az eredeti képeket, mert bár azok stock képek, és ez az oldal 
                                oktatási célból készült, mégis jogos érdekbe ütközne, ha itt ilyen mennyiségben használnánk őket.
                                Egyelőre még erre nem találtunk megoldást, hogy ingyen, vagy legalábbis nagyon olcsón ilyen mennyiségű képet
                                letöltve, vagy csak linkelve használhatnánk. 😢</li>
                            <li>Holnap valószínűleg - ha a rendszerek lelkivilága is engedi - elkészülnek a hatodikos 
                                irodalom jegyzetek is, és várhatóan a hét végéig a történelem fejezetek is elkészülnek.
                                Folyamatosan készülnek a jegyzetek, tananyagok.
                            </li>
                            <li>
                                Minden felhasználót bíztatunk arra, hogy ha hibát talál pl a jegyzetekben, vagy kiegészítést kér, 
                                esetleg kreatív ötlet másfajta tananyagokra, tesztekre,
                                egyéb kérdés, kérés, óhaj, sóhaj, vélemény van, azt írjátok meg 
                                <a href="mailto:frontneststudio@gmail.com"><b class="appLink">📧 emailben!</b></a>           
                            </li>
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

                  <div class="titleBox">
                    <p class="title">Egyéb</p>
                  </div>
                      
                      <div class="natJegyzetek">
                        <label class="mainLabel">Nyelvtanulás</label>
                        <a href="" class="appLink">Szótárak</a>
                        <a href="" class="appLink">Flipcards</a>
                        <a href="" class="appLink">Teszt</a>
                      </div>

                      <div class="natJegyzetek">
                        <label class="mainLabel">Matematika</label>
                        <a href="" class="appLink">01</a>
                        <a href="" class="appLink">02</a>
                        <a href="" class="appLink">03</a>
                      </div>

                      <div class="natJegyzetek">
                        <label class="mainLabel">Egyéb</label>
                        <a href="" class="appLink">01</a>
                        <a href="" class="appLink">02</a>
                        <a href="" class="appLink">03</a>
                      </div>
              </div>    
        </div>
            
    </div>
  );
}

export default App;

