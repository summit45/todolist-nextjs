import Head from 'next/head'
import Link from 'next/link'
import { authService } from '/src/firebase/firebase.js';
import { useState, useEffect } from "react";
import Main from "/pages/navigations/main";
import Auth from "/pages/navigations/auth";

function Home() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
        setIsLoggedIn(true);
      }
      else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Todolist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {init ?
          (<>
            <div>
              {isLoggedIn ? (
                <ul>
                  <Main userObj={userObj} />
                  <div className="navigation">
                    <li><Link href="navigations/main/">Home</Link></li>
                    <li><Link href="navigations/profile/">Profile</Link></li>
                    <li><Link href="navigations/auth/">Change Login</Link></li>
                  </div>
                </ul>
              ) : (
                <>
                  <Auth />
                  <div className="navigation">
                    <li><Link href="navigations/main/">Home</Link></li>
                    <li><Link href="navigations/profile/">Profile</Link></li>
                    <li><Link href="navigations/auth/">Change Login</Link></li>
                  </div>
                </>
              )}
            </div>
          </>
          ) : (
            "Initializing..."
          )}
      </main>

      <footer className='footer'>&copy; LeeSuMin {new Date().getFullYear()} </footer>

    </div>
  )
};

export default Home;