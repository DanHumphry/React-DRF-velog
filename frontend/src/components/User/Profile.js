import React, { useState, useEffect } from 'react';
import '../../css/Profile.css';
import { useHistory } from 'react-router';

function Profile(props){
    const history = useHistory()
    let [infoModal, setInfomodal] = useState(false)
    let [nicknmaModal, setNickname] = useState(false)
    let [socialModal, setSocialModal] = useState(false)
    
//profile
    let [userId, setUserId] = useState()
    let [userPhoto, setUserPhoto] = useState()
    let [userEmail, setUserEmail] = useState("")
    let [userMygit, setUserMygit] = useState("")
    let [userNickname, setUserNickname] = useState("")
    let [usermyInfo, setUserMyInfo] = useState("")

    useEffect(()=>{
        fetch('http://localhost:8000/user/current/', {
          headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`
          }
        })
        .then(res => res.json())
        .then(json => {
          // 현재 유저 정보 받아왔다면, 로그인 상태로 state 업데이트 하고
          if (json.id) {
            setUserId(json.id)
            //유저정보를 받아왔으면 해당 user의 프로필을 받아온다.
        }fetch('http://localhost:8000/user/auth/profile/' + json.id + '/update/',{
                method : 'PATCH',
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                },
            })
            .then((res)=>res.json())
            .then((userData)=> {
                setUserPhoto(userData.photo)
                setUserEmail(userData.email)
                setUserMygit(userData.mygit)
                setUserNickname(userData.nickname)
                setUserMyInfo(userData.myInfo)
            })
            .catch(error => {
                console.log(error);
              });;
        }).catch(error => {
            console.log(error)
          });
    },[userId])

    let sendData;
    const handleEffect = (handleSubmit) => {
        sendData = {
            email : userEmail,
            mygit : userMygit,
            nickname : userNickname,
            myInfo : usermyInfo
        }
        handleSubmit()
    }

    const handleSubmit = () => {
        let form_data = new FormData();
        form_data.append('email', sendData.email);
        form_data.append('mygit', sendData.mygit);
        form_data.append('nickname', sendData.nickname);
        form_data.append('myInfo', sendData.myInfo);
        fetch('http://localhost:8000/user/auth/profile/' + userId + '/update/', {
            method : 'PATCH',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));
    };

    const handleImageSubmit = () => {
        let form_data = new FormData();
        let fileField = document.querySelector('input[type="file"]');
        form_data.append('photo', fileField.files[0])

        fetch('http://localhost:8000/user/auth/profile/' + userId + '/update/', {
            method : 'PATCH',
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
            },
            body : form_data
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', JSON.stringify(response)));
    };

    const DeleteUser = ()=>{
        if(window.confirm('정말 삭제하시겠습니까 ?')===true){
            fetch('http://localhost:8000/user/current/', {
                headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(json => {
                fetch('http://localhost:8000/user/auth/profile/' + json.id + '/delete/',{
                    method : 'DELETE',
                    headers: {
                        Authorization: `JWT ${localStorage.getItem('token')}`,
                    },
                })
                .then((res)=>res.json())
                .catch(error => {
                    console.log(error);
                    });;
            }).catch(error => {
                console.log(error)
            });
            props.handleLogout()
            history.push('/')
        }
    }

    return(
        <>
            <main className="profile-main">
                <section className="section1">
                    <div className="thumbnail__">
                        <img src={userPhoto} alt=""></img>
                        <label htmlFor="file" className="img-up">
                            <input type="file" id="file" accept=".jpg, .png, .jpeg, .gif" onChange={(e)=>{
                                e.preventDefault();
                                let reader = new FileReader();
                                let file = e.target.files[0];
                                reader.onloadend = () => {
                                setUserPhoto(reader.result)
                                }
                                reader.readAsDataURL(file);
                            }}></input>
                        이미지 업로드</label>
                        <button className="img-de" onClick={()=>{
                            handleImageSubmit()
                            setInfomodal(false)
                            setNickname(false)
                            setSocialModal(false)
                            history.go(0)
                        }}>저장</button>
                    </div>
                    <div className="profile-info">
                        {
                            infoModal === true
                            ?(
                                <form>
                                    <input value={usermyInfo} placeholder={usermyInfo} onChange={(e)=>{
                                        setUserMyInfo(e.target.value)
                                    }}></input>
                                </form>
                            )
                            :(
                                <>
                                <h2>{usermyInfo}</h2>
                                <button className="fix-button" onClick={()=>{
                                    setInfomodal(true)
                                }}>자기소개 수정</button>
                                </>
                            )
                        }
                    </div>
                </section>

                <section className="section2">
                    <div className="myProfile">
                        <div className="wrapper">
                            <div className="title-wrapper">
                                <h3>닉네임</h3>
                            </div>
                            <div className="block-for-mobile">
                                {
                                    nicknmaModal === true
                                    ?null
                                    :<div className="contents">{userNickname}</div>
                                }
                                    
                                {
                                    nicknmaModal === true
                                    ?(
                                        <form className="nickname-form">
                                            <input className="nickname-input" placeholder={userNickname} onChange={(e)=>{
                                                setUserNickname(e.target.value)
                                            }}></input>
                                        </form>
                                        
                                    )
                                    :(
                                        <div className="edit-wrapper">
                                            <button className="fix-button" onClick={()=>{setNickname(true)}}>수정</button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>    
                    </div>

                    <div className="myProfile">
                        <div className="wrapper">
                            <div className="title-wrapper">
                                <h3>소셜 정보</h3>
                            </div>
                            <div className="block-for-mobile">
                                <div className="contents">
                                    {
                                        socialModal === true
                                        ?(
                                                <form>
                                                    <ul className="social-contents">
                                                        <li>
                                                            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="currentColor" d="M16 16.871L1.019 5H30.98L16 16.871zm0 3.146L1 8.131V27h30V8.131L16 20.017z"></path></svg>
                                                            <input className="social-input" placeholder={userEmail} onChange={(e)=>{
                                                                setUserEmail(e.target.value)
                                                            }}></input>
                                                        </li>
                                                        <li>
                                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><mask id="github" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#ffffff" fillRule="evenodd" d="M6.69 15.944c0 .08-.093.145-.21.145-.133.012-.226-.053-.226-.145 0-.081.093-.146.21-.146.12-.012.226.053.226.146zm-1.255-.182c-.028.08.053.173.174.198.105.04.226 0 .25-.081.024-.08-.053-.173-.174-.21-.104-.028-.221.012-.25.093zm1.783-.068c-.117.028-.198.104-.186.197.012.08.117.133.238.105.117-.028.198-.105.186-.186-.012-.076-.121-.129-.238-.116zM9.87.242C4.278.242 0 4.488 0 10.08c0 4.471 2.815 8.298 6.835 9.645.516.093.697-.226.697-.488 0-.25-.012-1.63-.012-2.476 0 0-2.822.605-3.415-1.202 0 0-.46-1.173-1.121-1.475 0 0-.924-.633.064-.621 0 0 1.004.08 1.557 1.04.883 1.557 2.363 1.109 2.94.843.092-.645.354-1.093.645-1.36-2.255-.25-4.529-.576-4.529-4.455 0-1.109.307-1.665.952-2.375-.105-.262-.448-1.342.105-2.738C5.56 4.157 7.5 5.51 7.5 5.51a9.474 9.474 0 0 1 2.532-.344c.86 0 1.726.117 2.533.343 0 0 1.939-1.355 2.782-1.089.552 1.4.21 2.476.105 2.738.645.714 1.04 1.27 1.04 2.375 0 3.891-2.375 4.202-4.63 4.456.372.319.686.923.686 1.87 0 1.36-.012 3.041-.012 3.372 0 .262.186.58.698.488C17.266 18.379 20 14.552 20 10.08 20 4.488 15.464.24 9.871.24zM3.919 14.149c-.052.04-.04.133.029.21.064.064.157.093.21.04.052-.04.04-.133-.029-.21-.064-.064-.157-.092-.21-.04zm-.435-.326c-.028.052.012.117.093.157.064.04.145.028.173-.028.028-.053-.012-.117-.093-.158-.08-.024-.145-.012-.173.029zm1.306 1.435c-.064.053-.04.174.053.25.092.093.21.105.262.04.052-.052.028-.173-.053-.25-.088-.092-.21-.104-.262-.04zm-.46-.593c-.064.04-.064.146 0 .238.065.093.174.133.226.093.065-.053.065-.157 0-.25-.056-.093-.16-.133-.225-.08z" clipRule="evenodd"></path></mask><g mask="url(#github)"><path fill="currentColor" d="M0 0h20v20H0z"></path></g></svg>
                                                            <input className="social-input" placeholder={userMygit} onChange={(e)=>{
                                                                setUserMygit(e.target.value)
                                                            }}></input>
                                                        </li>
                                                    </ul>
                                                </form>
                                        )
                                        :(
                                            <ul className="social-contents">
                                                <li>
                                                    <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="currentColor" d="M16 16.871L1.019 5H30.98L16 16.871zm0 3.146L1 8.131V27h30V8.131L16 20.017z"></path></svg>
                                                    <span>{userEmail}</span>
                                                </li>
                                                <li>
                                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><mask id="github" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#ffffff" fillRule="evenodd" d="M6.69 15.944c0 .08-.093.145-.21.145-.133.012-.226-.053-.226-.145 0-.081.093-.146.21-.146.12-.012.226.053.226.146zm-1.255-.182c-.028.08.053.173.174.198.105.04.226 0 .25-.081.024-.08-.053-.173-.174-.21-.104-.028-.221.012-.25.093zm1.783-.068c-.117.028-.198.104-.186.197.012.08.117.133.238.105.117-.028.198-.105.186-.186-.012-.076-.121-.129-.238-.116zM9.87.242C4.278.242 0 4.488 0 10.08c0 4.471 2.815 8.298 6.835 9.645.516.093.697-.226.697-.488 0-.25-.012-1.63-.012-2.476 0 0-2.822.605-3.415-1.202 0 0-.46-1.173-1.121-1.475 0 0-.924-.633.064-.621 0 0 1.004.08 1.557 1.04.883 1.557 2.363 1.109 2.94.843.092-.645.354-1.093.645-1.36-2.255-.25-4.529-.576-4.529-4.455 0-1.109.307-1.665.952-2.375-.105-.262-.448-1.342.105-2.738C5.56 4.157 7.5 5.51 7.5 5.51a9.474 9.474 0 0 1 2.532-.344c.86 0 1.726.117 2.533.343 0 0 1.939-1.355 2.782-1.089.552 1.4.21 2.476.105 2.738.645.714 1.04 1.27 1.04 2.375 0 3.891-2.375 4.202-4.63 4.456.372.319.686.923.686 1.87 0 1.36-.012 3.041-.012 3.372 0 .262.186.58.698.488C17.266 18.379 20 14.552 20 10.08 20 4.488 15.464.24 9.871.24zM3.919 14.149c-.052.04-.04.133.029.21.064.064.157.093.21.04.052-.04.04-.133-.029-.21-.064-.064-.157-.092-.21-.04zm-.435-.326c-.028.052.012.117.093.157.064.04.145.028.173-.028.028-.053-.012-.117-.093-.158-.08-.024-.145-.012-.173.029zm1.306 1.435c-.064.053-.04.174.053.25.092.093.21.105.262.04.052-.052.028-.173-.053-.25-.088-.092-.21-.104-.262-.04zm-.46-.593c-.064.04-.064.146 0 .238.065.093.174.133.226.093.065-.053.065-.157 0-.25-.056-.093-.16-.133-.225-.08z" clipRule="evenodd"></path></mask><g mask="url(#github)"><path fill="currentColor" d="M0 0h20v20H0z"></path></g></svg>
                                                    <span>{userMygit}</span>
                                                </li>
                                            </ul>
                                        )  
                                    }
                                </div>
                                {
                                    socialModal === true
                                    ? null
                                    :(
                                        <div className="edit-wrapper">
                                            <button className="fix-button" onClick={()=>{setSocialModal(true)}}>수정</button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>    
                    </div>

                    <div className="myProfile">
                        <div className="wrapper">
                            <div className="title-wrapper">
                            </div>
                            <div className="block-for-mobile">
                                <div className="contents">
                                    <button className="out-button" onClick={DeleteUser}>회원탈퇴</button>
                                    <button className="save-button" onClick={()=>{
                                        handleEffect(handleSubmit)
                                        setInfomodal(false)
                                        setNickname(false)
                                        setSocialModal(false)
                                    }}>저장</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </section>
            </main>
        </>
    )
}
export default Profile;