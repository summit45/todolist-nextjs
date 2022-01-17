import { faComment, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { dbService, storageService } from '/src/firebase/firebase.js';

const Comment = ({ listObjComment, listObj }) => {

    const [isOwner, setIsOwner] = useState(false);
    const [isText, setIsText] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newlist, setNewList] = useState(listObjComment.text);
    const [comments, setComments] = useState([]); // 하나의 글에 대한 댓글목록
    
     // 댓글 실시간 구현
     useEffect(() => {
        dbService.collection("comments").onSnapshot(snapshot => {
            const listArrayComment = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(listArrayComment);
        });
    }, []);

    useEffect(() => {
        if (listObjComment.whichText === listObj.randomidx) {
            setIsText(true);
        }
        else {
            setIsText(false);
        }

        if (listObjComment.userBoolean) {
            setIsOwner(true);
        }
        else {
            setIsOwner(false);
        }
        console.log(listObjComment.text + isText);
        console.log(listObjComment.text + isOwner +"owner");
    }, []);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok);
        if (ok) {
            await dbService.doc(`comments/${listObjComment.id}`).delete();
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`todolists/${listObj.id}`).update({
            text: newlist,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewList(value);
    };

    return (
        <div className="comment">
            {
                editing ? (
                    <>
                        {isOwner && (
                            <>
                                <form onSubmit={onSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Edit your todolist"
                                        value={newlist}
                                        required
                                        onChange={onChange}
                                    />
                                    <input type="submit" value="Update todolist" />
                                </form>
                                <button onClick={toggleEditing}>Cancel</button>
                            </>)
                        }
                    </>
                ) : (
                    <> 
                        {isText && (
                            <>
                            <h4>{listObjComment.text}</h4>
                            </>
                        )}
                     
                        {isOwner && (
                            <>
                                <div className="todolist_actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            </>
                        )}
                    </>
                )
            }
        </div>
    );
};

export default Comment;