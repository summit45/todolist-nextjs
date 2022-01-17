import { useState, useEffect } from "react";
import { dbService, storageService } from '/src/firebase/firebase.js';
import { v4 as uuidv4 } from "uuid";
import Todolist from "/components/todolist";

const Main = ( {userObj} ) => {
    const[todolist, setTodolist] = useState("");
    const[todolists, setTodolists] = useState([]);
    const[attachment, setAttachment] = useState("");

    useEffect(()=>{
        dbService.collection("todolists").onSnapshot(snapshot => {
            const listArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTodolists(listArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "" ){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const listObj = {
            text : todolist,
            createdAt : Date.now(),
            creatorId : userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("todolists").add(listObj);
        setTodolist(""); // submit하고 나서 빈문자열로 바꿔주기
        setAttachment("");
    };
    
    const onChange = (event) => {
        const {target : {value}} = event;
        setTodolist(value);
    };

    const onFileChange = (event) => {
        const {target : {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            const {currentTarget : { result }} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);
    
    return (
        <div>
            <p>HomePage</p>

            <form onSubmit={onSubmit}>
                <input 
                    value={todolist} 
                    onChange={onChange}
                    type="text" 
                    placeholder="Write your list to do" 
                    maxLength={120} 
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Add" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {todolists.map((todolist) => (
                    <Todolist 
                        key={todolist.id}
                        listObj={todolist}
                        isOwner={todolist.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Main;