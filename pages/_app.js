import '/styles/globals.css'
// import { authService } from '/src/firebase/firebase.js';
// import Main from "/pages/navigations/main";
// import { useState, useEffect } from "react";

// function MyApp({ Main, userObjs }) {
//   // userObj 모든 페이지에서 공유할 수 있게
//   const [init, setInit] = useState(false);
//   const [userObj, setUserObj] = useState(null); 
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   useEffect(() => {
//       authService.onAuthStateChanged((user) => {
//       if (user) {
//           setUserObj({
//           displayName: user.displayName,
//           uid: user.uid,
//           updateProfile: (args) => user.updateProfile(args),
//           });
//           setIsLoggedIn(true);
//       }
//       else {
//           setUserObj(null);
//       }
//       setInit(true);
//       });
//   }, []);
//   return <Main userobjs = {userObj} />
// }

// export default MyApp

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp