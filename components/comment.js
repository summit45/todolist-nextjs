import { faComment, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { dbService, storageService } from '/src/firebase/firebase.js';

const Comment = ({ listObjComment, listObj }) => {

    const [isText, setIsText] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newlist, setNewList] = useState(listObjComment.text);

    useEffect(() => {
        if (listObjComment.whichText === listObj.randomidx) {
            setIsText(true);
            console.log(listObjComment.text + isText);
        }
        else {
            setIsText(false);
        }
    });

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this comment?");
        if (ok) {
            await dbService.doc(`comments/${listObjComment.id}`).delete();
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`comments/${listObjComment.id}`).update({
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
                                <form onSubmit={onSubmit} className="container todolistEdit">
                                    <input
                                        type="text"
                                        placeholder="Edit your comment"
                                        value={newlist}
                                        required
                                        onChange={onChange}
                                    />
                                    <input type="submit" value="Update comment" className="formBtn" />
                                </form>
                                <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
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