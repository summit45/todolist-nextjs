import { authService } from '/src/firebase/firebase.js';
import { useState, useEffect } from "react";

const Base = () => {

    // userObj 모든 페이지에서 공유할 수 있게
    const [userObj, setUserObj] = useState(null); 
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

}
export default Base;
