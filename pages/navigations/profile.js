import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authService } from '/src/firebase/firebase.js';

const Profile = ({ userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayname);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
        }
    };

    return (
        <>
            <p>ProfilePage</p>
            <Profile userObj={userObj} />
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
};

export default Profile;