import React, { useState, useEffect, useRef } from 'react';
import '../../css/Detail.css';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router'

function Detail(props){
    const history = useHistory()
    let Today = new Date();
    let date = Today.getFullYear() + "-" + Today.getMonth() + "-" + Today.getDate()
    let pgN = document.location.href.split('/')[4]

    let [detailList, setDetailList] = useState({});
    let [detailUserInfo, setDetailUserInfo] = useState({});
    let [detailDate, setDetailDate] = useState();
    let [detailLang, setDetailLang] = useState([]);

    let [detailLikedUser, setDetailLikedUser] = useState([]);
    let [svgColor, setSvgColor] = useState({});

    let [currnetUser, setCurrentUser] = useState({});
    
    const githubLink = ()=>{
        if (detailUserInfo.mygit !== "") {
            window.open("https://github.com/" + detailUserInfo.mygit)
        }else{
            alert("연결된 계정이 없습니다.")
        }
    }
    const EmailLink = ()=>{
        if (detailUserInfo.email !== "") {
            window.open("mailto:" + detailUserInfo.email)
        }else{
            alert("연결된 계정이 없습니다.")
        }
    }

    useEffect(()=>{
        fetch('http://localhost:8000/api/Todos/' + pgN + "/")
        .then((res)=>res.json())
            .then((posts)=>{
                setDetailList(posts)
                let Y = posts.date.split('-')[0]
                let M = posts.date.split('-')[1]
                let D = posts.date.split('-')[2].split('T')[0]
                setDetailDate(Y + "년 " + M + "월 " + D + "일")
                setDetailLang(posts.language.split(','))
                setDetailLikedUser(posts.likedUser.split(','))
                
                fetch('http://localhost:8000/user/current/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
                })
                .then(res => res.json())
                .then(json => {
                fetch('http://localhost:8000/user/auth/profile/' + json.id + '/update/',{
                        method : 'PATCH',
                        headers: {
                            Authorization: `JWT ${localStorage.getItem('token')}`
                        },
                    })
                    .then((res)=>res.json())
                    .then((userData)=> {
                        setCurrentUser(userData)
                        if(posts.likedUser.split(',').indexOf(userData.user_pk + "") !== -1){
                            setSvgColor({color : "black"})
                        }else{
                            setSvgColor({color : "gray"})
                        }
                    })
                })  
                fetch('http://localhost:8000/user/auth/profile/' + posts.user_pk + '/')
                .then((res)=>res.json())
                .then((info)=>{
                    setDetailUserInfo(info)
                })
            })
    },[pgN])

    const DelBoard = ()=>{
        if(currnetUser.user_pk === detailList.user_pk){
            if(window.confirm('정말 삭제하시겠습니까 ?')===true){
                fetch('http://localhost:8000/api/Todos/' + pgN + "/delete/", {
                method : 'DELETE',
                headers: {
                    Authorization : `JWT ${localStorage.getItem('token')}`,
                }
                })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', JSON.stringify(response)));
                history.push('/')
            }
        }else{
            alert("권한이 없습니다.")
        }
    }

    const UpdateBoard = () => {
        detailList.user_pk === currnetUser.user_pk
        ? history.push("/update/"+pgN)
        : alert("권한이 없습니다.")
    }


    let sendData;
    const handleEffect = (ClickLikeBtn) => {
        if(currnetUser.user_pk !== null && currnetUser.user_pk !== undefined){
        // detailLikedUser라는 state값이 currentUser.user_pk(접속해있는 유저의 pk값)을 index로 가지고있지 않다면
            if(detailLikedUser.indexOf(currnetUser.user_pk + "") === -1){ //추천
                let arr = [...detailLikedUser]
                arr.push(currnetUser.user_pk)
                let plusUser = arr.join(',')
                sendData = {
                    like : detailList.like + 1,
                    likedUser : plusUser
                }
                setSvgColor({color : "black"})
            }else{ //추천취소
                let arr = [...detailLikedUser]
                arr.splice(arr.indexOf(currnetUser.user_pk + ""), 1)
                let minusUser = arr.join(',')
                sendData = {
                    like : detailList.like - 1,
                    likedUser : minusUser
                }
                setSvgColor({color : "gray"}) 
            }
            ClickLikeBtn()
        }else{
            alert("로그인이 필요합니다.")
        }
        
    }

    const ClickLikeBtn = ()=>{
        let form_data = new FormData();
        form_data.append('like', sendData.like);
        form_data.append('likedUser', sendData.likedUser);

        fetch('http://localhost:8000/api/Todos/' + pgN + "/update/", {
            method : 'PATCH',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(()=>{
            fetch('http://localhost:8000/api/Todos/' + pgN + "/")
            .then((res)=>res.json())
            .then((posts)=>{
                setDetailList(posts)
                setDetailLikedUser(posts.likedUser.split(','))
            });
        })
    }

    let [commentContent, setCommentContent] = useState();
    let commentTxt = useRef(null)

    let commentData;
    const CommentEffect = (CommentSubmit) => {
        commentData = {
            content : commentContent,
            date : date,
            username : props.user,
            profileImage : currnetUser.photo,
            user_pk : currnetUser.user_pk,
            todo_pk : pgN
        }
        CommentSubmit()
    }

    let [commentList, setCommentList] = useState([]);
    let [updateModal, setUpdateModal] = useState([]);

    const CommentSubmit = () => {
        let form_data = new FormData();

        form_data.append('content', commentData.content);
        form_data.append('date', commentData.date);
        form_data.append('username', commentData.username);
        form_data.append('profileImage', commentData.profileImage)
        form_data.append('user_pk', commentData.user_pk);
        form_data.append('todo_pk', commentData.todo_pk);

        fetch("http://localhost:8000/api/CommentTodos/", {
            method : 'POST',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)))
        .then(()=>{
            fetch('http://localhost:8000/api/CommentTodos/')
            .then((res)=>res.json())
            .then((posts)=>{
                setCommentList(posts)
                commentTxt.current.value = "";
            })
            setCommentContent("")
        })
    };

    useEffect(()=>{
        fetch('http://localhost:8000/api/CommentTodos/')
        .then((res)=>res.json())
        .then((posts)=>{
            let result = posts.filter( x => {
                return x.todo_pk + "" === pgN
            })
            setCommentList(result)
        })
    },[])

    const DelComment = (writeUser_pk, comment_id)=>{
        if(currnetUser.user_pk === writeUser_pk){
            if(window.confirm('정말 삭제하시겠습니까 ?')===true){
                fetch('http://localhost:8000/api/CommentTodos/' + comment_id + "/delete/", {
                method : 'DELETE',
                headers: {
                    Authorization : `JWT ${localStorage.getItem('token')}`,
                }
                })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', JSON.stringify(response)))
                .then(()=>{
                    fetch('http://localhost:8000/api/CommentTodos/')
                    .then((res)=>res.json())
                    .then((posts)=>{
                        setCommentList(posts)
                    })
                });
            }
        }else{
            alert("권한이 없습니다.")
        }
    }

    let commentUpdateData;
    const CommentUpdateEffect = (CommentUpdateSubmit, commnet_id) => {
        commentUpdateData = {
            content : commentContent,
            updateCount : 1
        }
        CommentUpdateSubmit(commnet_id)
    }

    const CommentUpdateSubmit = (commnet_id)=>{
        let form_data = new FormData();

        form_data.append('content', commentUpdateData.content);
        form_data.append('updateCount', commentUpdateData.updateCount);

        fetch('http://localhost:8000/api/CommentTodos/' + commnet_id + "/update/", {
            method : 'PATCH',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(()=>{
            let arr = [...updateModal]
            arr.splice(arr.indexOf(commnet_id), 1)
            setUpdateModal(arr)

            fetch('http://localhost:8000/api/CommentTodos/')
            .then((res)=>res.json())
            .then((posts)=>{
                setCommentList(posts)
            })
        });
    }

    let [reCommentModal, setReCommentModal] = useState([])
    let [reCommentContent, setReCommentContent] = useState("")
    let [reCommentList, setReCommentList] = useState([])
    let RecommentTxt = useRef(null)

    let RecommentData;
    const ReCommentEffect = (ReCommentSubmit, comment_id) => {
        RecommentData = {
            content : reCommentContent,
            date : date,
            username : props.user,
            profileImage : currnetUser.photo,
            user_pk : currnetUser.user_pk,
            todo_pk : pgN,
            commentTodo_pk : comment_id
        }
        ReCommentSubmit()
    }

    const ReCommentSubmit = () => {
        let form_data = new FormData();

        form_data.append('content', RecommentData.content);
        form_data.append('date', RecommentData.date);
        form_data.append('username', RecommentData.username);
        form_data.append('profileImage', RecommentData.profileImage)
        form_data.append('user_pk', RecommentData.user_pk);
        form_data.append('todo_pk', RecommentData.todo_pk);
        form_data.append('commentTodo_pk', RecommentData.commentTodo_pk);

        fetch("http://localhost:8000/api/ReCommentTodos/", {
            method : 'POST',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)))
        .then(()=>{
            fetch('http://localhost:8000/api/ReCommentTodos/')
            .then((res)=>res.json())
            .then((posts)=>{
                setReCommentList(posts)
                RecommentTxt.current.value = "";
            })
            setReCommentContent("")
        })
    };
    
    let [reCommentCount, setReCommentCount] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:8000/api/ReCommentTodos/')
        .then((res)=>res.json())
        .then((posts)=>{
            let result = posts.filter( x => {
                return x.todo_pk + "" === pgN
            })
            setReCommentList(result)
            let arr = [...reCommentCount]
            posts.map((a)=>{
                arr.push(a.commentTodo_pk)
                setReCommentCount(arr)
                return null;
            })
        })
    },[])

    const DelReComment = (writeUser_pk, Recomment_id)=>{
        if(currnetUser.user_pk === writeUser_pk){
            if(window.confirm('정말 삭제하시겠습니까 ?')===true){
                fetch('http://localhost:8000/api/ReCommentTodos/' + Recomment_id + "/delete/", {
                method : 'DELETE',
                headers: {
                    Authorization : `JWT ${localStorage.getItem('token')}`,
                }
                })
                .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', JSON.stringify(response)))
                .then(()=>{
                    fetch('http://localhost:8000/api/ReCommentTodos/')
                    .then((res)=>res.json())
                    .then((posts)=>{
                        setReCommentList(posts)
                    })
                });
            }
        }else{
            alert("권한이 없습니다.")
        }
    }
    let [reCommentUpdateModal, setReCommentUpdateModal] = useState([]);

    let RecommentUpdateData;
    const ReCommentUpdateEffect = (ReCommentUpdateSubmit, Recommnet_id) => {
        RecommentUpdateData = {
            content : reCommentContent,
            updateCount : 1
        }
        ReCommentUpdateSubmit(Recommnet_id)
    }

    const ReCommentUpdateSubmit = (Recommnet_id)=>{
        let form_data = new FormData();
        form_data.append('content', RecommentUpdateData.content);
        form_data.append('updateCount', RecommentUpdateData.updateCount);

        fetch('http://localhost:8000/api/ReCommentTodos/' + Recommnet_id + "/update/", {
            method : 'PATCH',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(()=>{
            let arr = [...reCommentUpdateModal]
            arr.splice(arr.indexOf(Recommnet_id), 1)
            setReCommentUpdateModal(arr)

            fetch('http://localhost:8000/api/ReCommentTodos/')
            .then((res)=>res.json())
            .then((posts)=>{
                setReCommentList(posts)
            })
        });
    }

    return(
        <>
            <div className="detail__container">
                <div className="detail__head-wrapper">
                    <h1>{detailList.title}</h1>
                    <div className="detail__head-btn">
                        {
                            detailList.user_pk === currnetUser.user_pk
                            ?(
                                <>
                                <button onClick={UpdateBoard}>수정</button>
                                <button onClick={DelBoard}>삭제</button>
                                </>
                            )
                            : null
                        }
                    </div>
                    <div className="detail__head-info">
                        <div className="information">
                            <span className="detail__head-username">{detailList.username}</span>
                            <span className="separator">·</span>
                            <span>{detailDate}{detailList.updateCount === 0 ? null : "  ·  수정됨"}</span>
                        </div>
                        <div className="detail__head-mobileLike">
                            <button className="likeBtn">
                                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                                <span>{detailList.like}</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="detail__head-like">
                        <div className="iCfLcp">
                            <div className="dtrfkW" onClick={()=>{handleEffect(ClickLikeBtn)}}>
                                <svg style={svgColor} width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                            </div>
                            <div className="sc-iyvyFf bJqQCy">{detailList.like}</div>
                        </div>
                    </div>
                    <div className="filetrList">
                    {
                        detailLang.map((a, i)=>{
                            return(
                                <p key={i}>{a}</p>
                            )
                        })
                    }
                    </div>
                    {
                        detailList.image === null
                        ? null
                        : <img src={detailList.image} alt=""></img>
                    }
                   
                </div>
                <div className="detail__body-wrapper">
                    <div className="detail__content">
                        <p>{detailList.content}</p>
                    </div>
                </div>

                <div className="detail__footer-wrapper">
                    <div className="detail__writerInfo">
                        <div className="detail__topInfo">
                            <Link to={"/mysite/" + detailList.user_pk}>
                                <img src={detailList.profileImage} alt=""></img>
                            </Link>
                            <div className="detail__userInfo">
                                <div className="description">{detailUserInfo.myInfo}</div>
                            </div>
                        </div>
                        <div className="sc-epnACN eIoWCE"></div>
                        <div className="detail__buttomInfo">
                        <div onClick={githubLink}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><mask id="github" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#ffffff" fillRule="evenodd" d="M6.69 15.944c0 .08-.093.145-.21.145-.133.012-.226-.053-.226-.145 0-.081.093-.146.21-.146.12-.012.226.053.226.146zm-1.255-.182c-.028.08.053.173.174.198.105.04.226 0 .25-.081.024-.08-.053-.173-.174-.21-.104-.028-.221.012-.25.093zm1.783-.068c-.117.028-.198.104-.186.197.012.08.117.133.238.105.117-.028.198-.105.186-.186-.012-.076-.121-.129-.238-.116zM9.87.242C4.278.242 0 4.488 0 10.08c0 4.471 2.815 8.298 6.835 9.645.516.093.697-.226.697-.488 0-.25-.012-1.63-.012-2.476 0 0-2.822.605-3.415-1.202 0 0-.46-1.173-1.121-1.475 0 0-.924-.633.064-.621 0 0 1.004.08 1.557 1.04.883 1.557 2.363 1.109 2.94.843.092-.645.354-1.093.645-1.36-2.255-.25-4.529-.576-4.529-4.455 0-1.109.307-1.665.952-2.375-.105-.262-.448-1.342.105-2.738C5.56 4.157 7.5 5.51 7.5 5.51a9.474 9.474 0 0 1 2.532-.344c.86 0 1.726.117 2.533.343 0 0 1.939-1.355 2.782-1.089.552 1.4.21 2.476.105 2.738.645.714 1.04 1.27 1.04 2.375 0 3.891-2.375 4.202-4.63 4.456.372.319.686.923.686 1.87 0 1.36-.012 3.041-.012 3.372 0 .262.186.58.698.488C17.266 18.379 20 14.552 20 10.08 20 4.488 15.464.24 9.871.24zM3.919 14.149c-.052.04-.04.133.029.21.064.064.157.093.21.04.052-.04.04-.133-.029-.21-.064-.064-.157-.092-.21-.04zm-.435-.326c-.028.052.012.117.093.157.064.04.145.028.173-.028.028-.053-.012-.117-.093-.158-.08-.024-.145-.012-.173.029zm1.306 1.435c-.064.053-.04.174.053.25.092.093.21.105.262.04.052-.052.028-.173-.053-.25-.088-.092-.21-.104-.262-.04zm-.46-.593c-.064.04-.064.146 0 .238.065.093.174.133.226.093.065-.053.065-.157 0-.25-.056-.093-.16-.133-.225-.08z" clipRule="evenodd"></path></mask><g mask="url(#github)"><path fill="currentColor" d="M0 0h20v20H0z"></path></g></svg>
                        </div>
                        <div onClick={EmailLink}>
                            <svg width="32" height="32" fill="none" viewBox="0 0 32 32" data-testid="email"><path fill="currentColor" d="M16 16.871L1.019 5H30.98L16 16.871zm0 3.146L1 8.131V27h30V8.131L16 20.017z"></path></svg>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="detail__comment-wrapper">
                    <h4>{commentList.length + reCommentList.length}개의 댓글</h4>
                    <div className="detail__comment-width">
                        <div>
                            <textarea ref={commentTxt} defaultValue="" placeholder="댓글을 작성하세요" className="comment__textarea" onChange={(e)=>{setCommentContent(e.target.value)}}></textarea>
                            <div className="buttons-wrapper">
                                <button className="comment__btn" onClick={()=>{CommentEffect(CommentSubmit)}}>댓글 작성</button>
                            </div>
                        </div>
                        <div className="margin__top">
                            <div></div>
                        </div>

                        {
                            commentList.map((a)=>{
                                let Y = a.date.split('-')[0]
                                let M = a.date.split('-')[1]
                                let D = a.date.split('-')[2].split('T')[0]
                                let commentFilterList;

                                if(a.todo_pk + "" === pgN){
                                    commentFilterList = 
                                        <div key={a.id} className="sc-rBLzX iNHoKr commentList__container">
                                            <div className="commentList__article">
                                                <div className="commentUserInfo">
                                                    <div className="commentProfile">
                                                        <Link to={"/mysite/" + a.user_pk}>
                                                            <img src={a.profileImage} alt=""/>
                                                        </Link>
                                                        <div className="comment-info">
                                                            <div className="commentUsername">
                                                                <Link to={"/mysite/" + a.user_pk}>{a.username}</Link>
                                                            </div>
                                                            <div className="commentDate">{Y + "년 " + M + "월 " + D + "일"}{a.updateCount === 0 ? null : "  ·  수정됨"}</div>
                                                        </div>
                                                    </div>
                                                    {
                                                        a.user_pk === currnetUser.user_pk && updateModal.indexOf(a.id) === -1
                                                        ? (
                                                            <div className="actions">
                                                                <span onClick={()=>{
                                                                    let arr = [...updateModal]
                                                                    arr.push(a.id)
                                                                    setUpdateModal(arr)
                                                                }}>수정</span>
                                                                <span onClick={()=>{DelComment(a.user_pk, a.id)}}>삭제</span>
                                                            </div>
                                                        )
                                                        : null
                                                    }
                                                </div>
                                                {
                                                    updateModal.indexOf(a.id) === -1
                                                    ?(
                                                        <div className="commentContent">
                                                            <div className="sc-CtfFt jUJTZI">
                                                                <div className="sc-kafWEX hQjZHl">
                                                                    <div className="sc-feJyhm gzDGWh atom-one-light">
                                                                        <p>{a.content}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                    :(
                                                        <div className="sc-hEsumM diaLmo">
                                                            <textarea defaultValue={a.content} placeholder="댓글을 작성하세요" className="sc-ktHwxA kMZaKo" onChange={(e)=>{setCommentContent(e.target.value)}}></textarea>
                                                            <div className="buttons-wrapper">
                                                                <button className="sc-dnqmqq eLHDzq" onClick={()=>{
                                                                    let arr = [...updateModal]
                                                                    arr.splice(arr.indexOf(a.id), 1)
                                                                    setUpdateModal(arr)
                                                                }}>취소</button>
                                                                <button className="sc-dnqmqq gzELJz" onClick={()=>{CommentUpdateEffect(CommentUpdateSubmit, a.id)}}>댓글 수정</button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className="reCommentOpen">
                                                    <div className="sc-hGoxap cHbAfK">
                                                        <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path fill="currentColor" d="M5.5 2.5h1v3h3v1h-3v3h-1v-3h-3v-1h3v-3z"></path><path fill="currentColor" fillRule="evenodd" d="M1 0a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm10 1H1v10h10V1z" clipRule="evenodd"></path></svg>
                                                        {
                                                            reCommentModal.indexOf(a.id) === -1
                                                            ?(
                                                                <>
                                                                {
                                                                    reCommentCount.filter(n => n === a.id).length === 0
                                                                    ?   <span onClick={()=>{
                                                                        let arr = [...reCommentModal]
                                                                        arr.push(a.id)
                                                                        setReCommentModal(arr)
                                                                        }}>답글 달기</span>
                                                                    :(
                                                                        <span onClick={()=>{
                                                                        let arr = [...reCommentModal]
                                                                        arr.push(a.id)
                                                                        setReCommentModal(arr)
                                                                        }}>{reCommentCount.filter(n => n === a.id).length}개의 답글</span>
                                                                    )
                                                                }
                                                                </>
                                                            )
                                                            : <span onClick={()=>{
                                                            let arr = [...reCommentModal]
                                                            arr.splice(arr.indexOf(a.id), 1)
                                                            setReCommentModal(arr)
                                                            }}>숨기기</span>
                                                        }
                                                    </div>
                                                    {
                                                        reCommentModal.indexOf(a.id) === -1
                                                        ? null
                                                        : (
                                                            <div className="sc-cIShpX cMzaJe">

                                                            {
                                                                reCommentList.map((reA)=>{
                                                                    let Y = reA.date.split('-')[0]
                                                                    let M = reA.date.split('-')[1]
                                                                    let D = reA.date.split('-')[2].split('T')[0]
                                                                    let ReCommentFilterList;

                                                                    if(a.id === reA.commentTodo_pk){
                                                                        ReCommentFilterList = 
                                                                        <>
                                                                            <div className="sc-kafWEX katOWY"></div>
                                                                                <div className="sc-elJkPf jRsZyA" key={reA.id}>
                                                                                    <div className="sc-cmTdod kzRjyM comment">
                                                                                        <div className="sc-jwKygS ezDpwK">
                                                                                            <div className="profile">
                                                                                                <Link to={"/mysite/" + reA.user_pk}>
                                                                                                    <img src={reA.profileImage} alt="comment-user-thumbnail"/>
                                                                                                </Link>
                                                                                                <div className="comment-info">
                                                                                                    <div className="username">
                                                                                                        <Link to={"/mysite/" + reA.user_pk}>{reA.username}</Link>
                                                                                                    </div>
                                                                                                    <div className="date">{Y + "년 " + M + "월 " + D + "일"}{reA.updateCount === 0 ? null : "  ·  수정됨"}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                reA.user_pk === currnetUser.user_pk && reCommentUpdateModal.indexOf(reA.id) === -1
                                                                                                ? (
                                                                                                    <div className="actions">
                                                                                                        <span onClick={()=>{
                                                                                                            let arr = [...reCommentUpdateModal]
                                                                                                            arr.push(reA.id)
                                                                                                            setReCommentUpdateModal(arr)
                                                                                                        }}>수정</span>
                                                                                                        <span onClick={()=>{DelReComment(reA.user_pk, reA.id)}}>삭제</span>
                                                                                                    </div>
                                                                                                )
                                                                                                : null
                                                                                            }
                                                                                        </div>
                                                                                        {
                                                                                            reCommentUpdateModal.indexOf(reA.id) === -1
                                                                                            ?(
                                                                                                <div className="sc-uJMKN fbcLAc">
                                                                                                    <div className="sc-btzYZH dfktCZ">
                                                                                                        <div className="sc-uJMKN fbcLAc">
                                                                                                            <div className="sc-bbmXgH gDQvzU atom-one-light">
                                                                                                                <p>{reA.content}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                            :(
                                                                                                <div className="sc-hEsumM diaLmo">
                                                                                                    <textarea placeholder="댓글을 작성하세요" className="sc-ktHwxA kMZaKo" defaultValue={reA.content} onChange={(e)=>{setReCommentContent(e.target.value)}}></textarea>
                                                                                                    <div className="buttons-wrapper">
                                                                                                        <button className="sc-dnqmqq eLHDzq" onClick={()=>{
                                                                                                            let arr = [...reCommentUpdateModal]
                                                                                                            arr.splice(arr.indexOf(reA.id), 1)
                                                                                                            setReCommentUpdateModal(arr)
                                                                                                        }}>취소</button>
                                                                                                        <button className="sc-dnqmqq gzELJz" onClick={()=>{ReCommentUpdateEffect(ReCommentUpdateSubmit, reA.id)}}>댓글 수정</button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div className="sc-feJyhm sMZHE"></div>
                                                                            </>
                                                                    }

                                                                    return(
                                                                        ReCommentFilterList
                                                                    )
                                                                })
                                                            } 
                                                                <div className="sc-elJkPf jRsZyA"></div>
                                                                <div className="sc-hEsumM diaLmo">
                                                                    <textarea ref={RecommentTxt} placeholder="댓글을 작성하세요" className="sc-ktHwxA kMZaKo" onChange={(e)=>{setReCommentContent(e.target.value)}}></textarea>
                                                                    <div className="buttons-wrapper">
                                                                        <button className="sc-dnqmqq gzELJz" onClick={()=>{ReCommentEffect(ReCommentSubmit, a.id)}}>댓글 작성</button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                }
                                return(
                                    commentFilterList
                                )
                            })
                        }
                        

                    </div>
                </div>
            </div>
        </>
    )
}
export default Detail;