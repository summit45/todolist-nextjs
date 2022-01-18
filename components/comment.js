import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { dbService } from '/src/firebase/firebase.js';

const Comment = ({ CommentObj, isOwner, isText }) => {

    const [editing, setEditing] = useState(false);
    const [newlist, setNewList] = useState(CommentObj.text);
    
    const onDeleteClick = async () => {
        if (isOwner){
            const ok = window.confirm("Are you sure you want to delete this comment?");
            if (ok) {
                await dbService.doc(`comments/${CommentObj.id}`).delete();
            }
        }
        else{
            const ok2 = window.confirm("You can't delete.");
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`comments/${CommentObj.id}`).update({
            text: newlist,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewList(value);
    };

    return (
        <div>
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
                    { isText && (
                        <form className="comment">
                            <h4>{CommentObj.text}</h4>
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
                        </form>
                    )}
                </>
            )
        }
        </div> 
    );
};

export default Comment;


/*{isText && (
                        <form className="comment">
                            <h4>{CommentObj.text}</h4>
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
                            )}*/
