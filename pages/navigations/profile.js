import { useRouter } from "next/router";
import { authService } from '/src/firebase/firebase.js';

const Profile = ({ userObj }) => {
    const router = useRouter();

    const onLogOutClick = () => {
        authService.signOut();
        router.replace('/');
    };

    return (
        <>
            <p>ProfilePage</p>
            <button onClick={onLogOutClick} className="formBtn cancelBtn logOut">Log out</button>
        </>
    );
};

export default Profile;

// 닉네임(이름) 바꾸기
// userObj 필요
// const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
// const onChange = (event) => {
//     const { target: { value } } = event;
//     setNewDisplayName(value);
// };
// const onSubmit = async (event) => {
//     event.preventDefault();
//     if (userObj.displayName !== newDisplayName) {
//         await userObj.updateProfile({
//             displayName: newDisplayName,
//         });
//     }
// };
