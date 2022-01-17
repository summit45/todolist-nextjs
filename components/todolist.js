import { useState, useEffect } from "react";
import { dbService, storageService } from '/src/firebase/firebase.js';

const Todolist = ({ listObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newlist, setNewList] = useState(listObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok);
        if (ok) {
            await dbService.doc(`todolists/${listObj.id}`).delete();
            await storageService.refFromURL(listObj.attachmentUrl).delete();
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
        <div>
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
                        <h4>{listObj.text}</h4>
                        {listObj.attachmentUrl && (
                            <img src={listObj.attachmentUrl} width="50px" height="50px" />
                        )}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Lists</button>
                                <button onClick={toggleEditing}>Edit Lists</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    );
};

export default Todolist;