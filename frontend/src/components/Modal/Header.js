import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import '../../css/Header.css';

function Header(props){

  let [userprofile, setUserprofile] = useState(false)
  let [userPhoto, setUserPhoto] = useState()
  let [currentUser_pk, setCurrentUser_pk] = useState();

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
            setCurrentUser_pk(userData.user_pk)
        })
        .catch(error => {
            console.log(error);
          });
    }).catch(error => {
        console.log(error)
      });
},[userPhoto])

  return(
    <>
      <div className="header">
        <div className="header-nav">
          <div className="header-nav-links">
            <Link className="header-logo" to="/">Velog</Link>
            {
              props.modal === false
              ? <Link to="/login"><button className="header-btn">로그인</button></Link>
              : (
                <>
                <Link className="header-dashboard" to="/write"><button>새 글 작성</button></Link>
                <div className="user-container" onClick={()=>{setUserprofile(!userprofile)}}>
                  <img src={userPhoto} className="user-image" alt="/"></img>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </div>
                {
                  userprofile === true
                  ?(
                    <div className="user-profile">
                      <div className="profile-menu">
                        <Link to={"/mysite/" + currentUser_pk}><div className="menu">내가 쓴 글</div></Link>
                        <Link to="/profile"><div className="menu">내 정보</div></Link>
                        <Link onClick={props.handleLogout} to="/"><div className="menu">로그아웃</div></Link>
                      </div>
                    </div>
                  )
                  :null
                }
                </>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Header;