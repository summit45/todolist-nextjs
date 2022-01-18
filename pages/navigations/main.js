import { useState, useEffect } from "react";
import { dbService, storageService } from '/src/firebase/firebase.js';
import { v4 as uuidv4 } from "uuid";
import Todolist from "/components/todolist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Main = ({ userObj }) => {
    const [todolist, setTodolist] = useState("");
    const [todolists, setTodolists] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
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
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const TodoListObj = {
            randomidx: Math.random(), // 어떤 글에 대한 답글인지, key사용하면 삭제
            text: todolist,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("todolists").add(TodoListObj);
        setTodolist(""); // submit하고 나서 빈문자열로 바꿔주기
        setAttachment("");
    };

    const onChange = (event) => {
        const { target: { value } } = event;
        setTodolist(value);
    };

    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);

    return (
        <div>
            <p>HomePage</p>

            <form onSubmit={onSubmit} className="factoryForm">
                <div className="factoryInput_container">
                    <input
                        className="factoryInput_input"
                        value={todolist}
                        onChange={onChange}
                        type="text"
                        placeholder="Write your list to do"
                        maxLength={120}
                    />
                    <input type="submit" value="&rarr;" className="factoryInput_arrow" />
                </div>
                <label htmlFor="attach-file" className="factoryInput_label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} width="10px" height="10px" />
                </label>
                <input 
                    id="attach-file"
                    type="file" 
                    accept="image/*" 
                    onChange={onFileChange} 
                    style={{
                        opacity:0,
                    }} 
                />
                {attachment && (
                    <div className="factoryFrom_attachment">
                        <img 
                            src={attachment}
                            style={{
                                backgroundImage: attachment,
                            }}
                        />
                        <div className="factoryForm_clear" onClick={onClearAttachment}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </form>
            <div>
                {todolists.map((todolist) => (
                    <Todolist
                        key={todolist.id}
                        TodoListObj={todolist}
                        isOwner={todolist.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Main;