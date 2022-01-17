import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { authService } from '/src/firebase/firebase.js';

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const [validLoggedIn, setValidLoggedIn] = useState(false);
    const router = useRouter();
    const mounted = useRef(false); // 업데이트 될때만

    useEffect(() => { // 로그인 되었다면
        if (!mounted.current){
            mounted.current = true;
        }
        else{
            console.log('login executed');
            router.replace('/');
        }
    }, [validLoggedIn]);

    const onChange = (event) => {
        const {target : {name,value}} = event;
        if (name === "email"){
            setEmail(value);
        }
        else if (name === "password"){
            setPassword(value);
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            let data;
            if(newAccount){
                data =  await authService.createUserWithEmailAndPassword(email, password);
            }
            else{
                data =  await authService.signInWithEmailAndPassword(email, password);
            }
            setValidLoggedIn(true); // 로그인된 경우
        }
        catch(error){
            setError(error.message);
        }
    }

    const toggleAccount=() => setNewAccount(prev => !prev);
    
    return (
        <div>
            <p>LoginPage</p>
            <form onSubmit={ onSubmit }>
                <input 
                    name="email" 
                    type="email"
                    placeholder="Write Email" 
                    required 
                    value={ email } 
                    onChange={ onChange }
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Write Password" 
                    required 
                    value={ password } 
                    onChange={ onChange } 
                />
                <input 
                    name="submit" 
                    type="submit"
                    value={ newAccount ? "CreateAccount" : "Sign In" }
                    onSubmit={ onSubmit }
                />
                <p>{ error }</p>
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign in" : "Create Account"}
            </span>
        </div>
    )
}
export default Auth;