import { faComment, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { dbService, storageService } from '/src/firebase/firebase.js';
import Comment from "/components/comment";

const Todolist = ({ listObj, isOwner }) => {

    const [editing, setEditing] = useState(false);
    const [commenting, setCommenting] = useState(false);
    const [newlist, setNewList] = useState(listObj.text);
    const [comment, setComment] = useState(""); // 현재 쓰는 댓글
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

    const onDeleteClick = async () => { // 삭제 버튼
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await dbService.doc(`todolists/${listObj.id}`).delete();
            await storageService.refFromURL(listObj.attachmentUrl).delete();
        }
    }

    const toggleEditing = () => setEditing((prev) => !prev);
    const toggleCommenting = () => setCommenting((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        const { target: { name } } = event;
        if (name === "editbtn") {
            await dbService.doc(`todolists/${listObj.id}`).update({
                text: newlist,
            });
            setEditing(false);
        }

        else if (name === "commentbtn") {
            console.log(listObj.randomidx);
            const listObjComment = {
                text: comment,
                createdAt: Date.now(),
                userBoolean: isOwner,
                whichText: listObj.randomidx,
            };
            await dbService.collection("comments").add(listObjComment);
            setComment(""); // submit하고 나서 빈문자열로 바꿔주기
        }
    };

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "edittext") {
            setNewList(value);
        }
        else if (name === "commenttext") {
            setComment(value);
        }
    };

    // edit text인지 comment text인지 구별하여 실행
    return (
        <div className="todolist">
            {
                editing ? (
                    <>
                        {isOwner && (
                            <>
                                <form name="editbtn" onSubmit={onSubmit} className="container todolistEdit">
                                    <input
                                        name="edittext"
                                        type="text"
                                        placeholder="Edit your todolist"
                                        value={newlist}
                                        required
                                        autoFocus
                                        onChange={onChange}
                                        className="formInput"
                                    />
                                    <input name="editbtn" type="submit" value="Update todolist" className="formBtn" />
                                </form>
                                <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                            </>)
                        }
                    </>
                ) : (
                    <>
                        {
                            commenting ? (
                                <>
                                        <>
                                            <form name="commentbtn" onSubmit={onSubmit} className="container todolistEdit">
                                                <input
                                                    name="commenttext"
                                                    type="text"
                                                    placeholder="Write your Comment"
                                                    value={comment}
                                                    onChange={onChange}
                                                    className="formInput"
                                                />
                                                <input name="commentbtn" type="submit" value="&rarr;" className="formBtn" />
                                            </form>
                                            <button onClick={toggleCommenting} className="formBtn cancelBtn">Cancel</button>
                                        </>)
                                </>

                            ) : (
                                <>

                                </>

                            )
                        }
                        <h4>{listObj.text}</h4>
                        {listObj.attachmentUrl && (
                            <img src={listObj.attachmentUrl} width="50px" height="50px" />
                        )}
                        {isOwner && (
                            <div className="todolist_actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                                <span onClick={toggleCommenting}>
                                    <FontAwesomeIcon icon={faComment} />
                                </span>
                            </div>
                        )}
                        {!isOwner && (
                            <div className="todolist_actions">
                                <span onClick={toggleCommenting}>
                                    <FontAwesomeIcon icon={faComment} />
                                </span>
                            </div>
                        )}
                    </>
                )
            }
            <div>
                {comments.map((comment) => (
                    <Comment
                        listObjComment={comment}
                        listObj={listObj}
                    />
                ))}
            </div>
        </div>
    );
};

export default Todolist;