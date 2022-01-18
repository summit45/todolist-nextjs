import { useState, useEffect } from "react";
import { authService } from '/src/firebase/firebase.js';

function Base() {

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



    return {
        init,
        userObj,
        isLoggedIn
    }
}

export async function getStaticProps() {
    const allData = Base();
    return{
      props:{
        allData,
      }
    }
}

export default Base