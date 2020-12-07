import React, { useState } from 'react';
import { useHistory } from 'react-router'
import '../../css/LoginModal.css';
import GoogleLogin from 'react-google-login';

function LoginModal(props){
  let [JoinLoign,setJoinLogin] = useState('로그인')
  const history = useHistory()

  //구글 아이디로 회원가입 및 이미 회원일경우
  let responseGoogle = (res)=>{
    let email = res.profileObj.email
    let id_token = res.profileObj.googleId

    let data = {
      username: email,
      password: id_token,
      provider: 'google'
    }

    fetch('http://localhost:8000/user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      if (json.username && json.token) {
        props.userHasAuthenticated(true, json.username, json.token);
        props.setModal(true);
        history.push("/");
      }else{
        // 서버에 Google 계정 이미 저장돼 있다면 Login 작업 수행
        // 로그인을 시도하기 전에 서버에 접근하기 위한 access token을 발급 받음
        fetch('http://localhost:8000/login/', {  
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(json => {
          // 발급 완료 되었다면 해당 토큰을 클라이언트 Local Storage에 저장
          if (json.user && json.user.username && json.token) {
            props.userHasAuthenticated(true, json.user.username, json.token);
            props.setModal(true);
            history.push("/");
          }
        })
        .catch(error => {
          console.log(error);
          window.gapi && window.gapi.auth2.getAuthInstance().signOut();
        });   
      }
    })
    .catch(error => {
      console.log(error);
      window.gapi && window.gapi.auth2.getAuthInstance().signOut();
    });
  }//구글 아이디로 회원가입 및 이미 회원일경우


  let [username, setUsername] = useState()
  let [userpassword, setUserPassword] = useState()
  
  const data = {username : username, password : userpassword}

  const handleNameChange = (e) => {
    setUsername(e.target.value)
  }
  const handlePasswordChange = (e) => {
    setUserPassword(e.target.value)
  }

  return(
    <>
      <div className="login-container">
        <div className="login-box">
          <div className="exit">
              <button onClick={()=>{ history.goBack() }}>
                <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
              </button>
          </div>
          <span>{JoinLoign}</span>
          <form>
            {
              JoinLoign === '로그인'
              ?(
                <>
                <input type="text" placeholder="아이디를 입력하세요" onChange={handleNameChange}/>
                <input type="password" placeholder="비밀번호를 입력하세요" id="password" onChange={handlePasswordChange}/>
                <button className="JoinLoign-button" onClick={(e)=>{
                  e.preventDefault()
                  fetch('http://localhost:8000/login/', {  
                  method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                  })
                  .then(res => res.json())
                  .then(json => {
                    // user data와 token정보가 일치하면 로그인 성공
                    if (json.user && json.user.username && json.token) {
                      props.userHasAuthenticated(true, json.user.username, json.token);
                      history.push("/");
                      props.setModal(true)
                      console.log(json)
                    }else{
                      alert("아이디 또는 비밀번호를 확인해주세요.")
                    }
                  })
                  .catch(error => alert(error));
                }}>{JoinLoign}</button>
                </>
              )
              :(
                <>
                <input type="text" placeholder="아이디를 입력하세요" onChange={handleNameChange}/>
                <input type="password" placeholder="비밀번호를 입력하세요" onChange={handlePasswordChange}/>
                <button className="JoinLoign-button" onClick={(e)=>{
                  e.preventDefault()
                  fetch('http://localhost:8000/user/', {
                    method: 'POST',
                    headers:{
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                  }).then(res => res.json())
                  .then(json => {
                    if (json.username && json.token) {
                      props.userHasAuthenticated(true, json.username, json.token);
                      history.push("/");
                      props.setModal(true)
                    }else{
                      alert("사용불가능한 아이디입니다.")
                    }
                  })
                  .catch(error => alert(error));
                }}
                >{JoinLoign}</button>
                </>
              )
            }
            
          </form>
          <section className="social-box">
            <h4>소셜 계정으로 {JoinLoign}</h4>
            <div className="googlebox">
              <GoogleLogin
                render={renderProps => (
                  <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="google-login">
                      <path fill="#4285F4" d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.92-.725 2.303-2.084 3.233l-.02.124 3.028 2.292.21.02c1.926-1.738 3.037-4.296 3.037-7.33z"></path>
                      <path fill="#34A853" d="M10.2 19.931c2.753 0 5.064-.886 6.753-2.414l-3.218-2.436c-.862.587-2.017.997-3.536.997a6.126 6.126 0 0 1-5.801-4.141l-.12.01-3.148 2.38-.041.112c1.677 3.256 5.122 5.492 9.11 5.492z"></path>
                      <path fill="#FBBC05" d="M4.398 11.937a6.008 6.008 0 0 1-.34-1.971c0-.687.125-1.351.329-1.971l-.006-.132-3.188-2.42-.104.05A9.79 9.79 0 0 0 .001 9.965a9.79 9.79 0 0 0 1.088 4.473l3.309-2.502z"></path>
                      <path fill="#EB4335" d="M10.2 3.853c1.914 0 3.206.809 3.943 1.484l2.878-2.746C15.253.985 12.953 0 10.199 0 6.211 0 2.766 2.237 1.09 5.492l3.297 2.503A6.152 6.152 0 0 1 10.2 3.853z"></path>
                    </svg>
                  </button>
                )}
                buttonText=""
                clientId="161501678517-il8gdqt5ak46nuh9r2oku23aeebg5f53.apps.googleusercontent.com"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}/>
            </div>
          </section>
          <div className="login-foot">
            {
              JoinLoign === '회원가입'
              ?
              (
                <>
                <span>이미 회원이신가요  ?</span>
                <div className="foot-link" onClick={(e)=>{
                e.preventDefault()
                setJoinLogin('로그인')
                }}>로그인</div>
                </>
              )
              :
              (
                <>
                <span>아직 회원이 아니신가요 ?</span>
                <div className="foot-link" onClick={(e)=>{
                e.preventDefault()
                setJoinLogin('회원가입')
                }}>회원가입</div>
                </>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}


export default LoginModal;