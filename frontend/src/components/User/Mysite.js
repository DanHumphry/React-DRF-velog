import React, {useEffect, useState} from 'react';
import '../../css/Mysite.css';
import { Link } from 'react-router-dom';

function Mysite(){
    let pgN = document.location.href.split('/')[4]

    const githubLink = ()=>{window.open("https://github.com/" + userMygit)}
    const EmailLink = ()=>{window.open("mailto:" + userEmail)}

    let [underline, setUnderline] = useState({left:"0%"})

    let [userSitePhoto, setUserSitePhoto] = useState();
    let [usermyInfo, setUserMyInfo] = useState("")
    let [userEmail, setUserEmail] = useState("")
    let [userMygit, setUserMygit] = useState("")
    let [todolist, setTodoList] = useState([])

    useEffect(()=>{
        fetch('http://localhost:8000/user/auth/profile/' + pgN + '/')
        .then((res)=>res.json())
        .then((info)=>{
            setUserSitePhoto(info.photo)
            setUserMyInfo(info.myInfo)
            setUserEmail(info.email)
            setUserMygit(info.mygit)
        })
    },[])

    useEffect(()=>{
        fetch('http://localhost:8000/api/Todos/')
        .then((res)=>res.json())
        .then((posts)=>{
            setTodoList(posts)
        })
    },[])

    return(
        <div className="main_section">
            <div className="header-section">
                <div className="profile">
                    <img src={userSitePhoto} alt="/"></img>
                    <div className="profile-info">
                        <div className="desc">{usermyInfo}</div>
                    </div>
                </div>
                <div className="line"></div>
                <div className="socila">
                     <div onClick={githubLink}>
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><mask id="github" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#ffffff" fillRule="evenodd" d="M6.69 15.944c0 .08-.093.145-.21.145-.133.012-.226-.053-.226-.145 0-.081.093-.146.21-.146.12-.012.226.053.226.146zm-1.255-.182c-.028.08.053.173.174.198.105.04.226 0 .25-.081.024-.08-.053-.173-.174-.21-.104-.028-.221.012-.25.093zm1.783-.068c-.117.028-.198.104-.186.197.012.08.117.133.238.105.117-.028.198-.105.186-.186-.012-.076-.121-.129-.238-.116zM9.87.242C4.278.242 0 4.488 0 10.08c0 4.471 2.815 8.298 6.835 9.645.516.093.697-.226.697-.488 0-.25-.012-1.63-.012-2.476 0 0-2.822.605-3.415-1.202 0 0-.46-1.173-1.121-1.475 0 0-.924-.633.064-.621 0 0 1.004.08 1.557 1.04.883 1.557 2.363 1.109 2.94.843.092-.645.354-1.093.645-1.36-2.255-.25-4.529-.576-4.529-4.455 0-1.109.307-1.665.952-2.375-.105-.262-.448-1.342.105-2.738C5.56 4.157 7.5 5.51 7.5 5.51a9.474 9.474 0 0 1 2.532-.344c.86 0 1.726.117 2.533.343 0 0 1.939-1.355 2.782-1.089.552 1.4.21 2.476.105 2.738.645.714 1.04 1.27 1.04 2.375 0 3.891-2.375 4.202-4.63 4.456.372.319.686.923.686 1.87 0 1.36-.012 3.041-.012 3.372 0 .262.186.58.698.488C17.266 18.379 20 14.552 20 10.08 20 4.488 15.464.24 9.871.24zM3.919 14.149c-.052.04-.04.133.029.21.064.064.157.093.21.04.052-.04.04-.133-.029-.21-.064-.064-.157-.092-.21-.04zm-.435-.326c-.028.052.012.117.093.157.064.04.145.028.173-.028.028-.053-.012-.117-.093-.158-.08-.024-.145-.012-.173.029zm1.306 1.435c-.064.053-.04.174.053.25.092.093.21.105.262.04.052-.052.028-.173-.053-.25-.088-.092-.21-.104-.262-.04zm-.46-.593c-.064.04-.064.146 0 .238.065.093.174.133.226.093.065-.053.065-.157 0-.25-.056-.093-.16-.133-.225-.08z" clipRule="evenodd"></path></mask><g mask="url(#github)"><path fill="currentColor" d="M0 0h20v20H0z"></path></g></svg>
                    </div>
                    <div onClick={EmailLink}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 32 32" data-testid="email"><path fill="currentColor" d="M16 16.871L1.019 5H30.98L16 16.871zm0 3.146L1 8.131V27h30V8.131L16 20.017z"></path></svg>
                    </div>
                </div>
            </div>

            <div className="nav-section">
                <div className="nav-margin">
                    <h2 to="/mysite" onClick={()=>{setUnderline({left:"0%"})}}>글</h2>
                    <h2 to="/mysite" onClick={()=>{setUnderline({left:"50%"})}}>시리즈</h2>
                    <div className="underline" style={underline}></div>
                </div>
            </div>

            <div className="contents-section">
                <div className="serch">
                    <section className="serch-section">
                        <div className="serch-div">
                            <svg width="17" height="17" viewBox="0 0 17 17"><path fillRule="evenodd" d="M13.66 7.36a6.3 6.3 0 1 1-12.598 0 6.3 6.3 0 0 1 12.598 0zm-1.73 5.772a7.36 7.36 0 1 1 1.201-1.201l3.636 3.635c.31.31.31.815 0 1.126l-.075.075a.796.796 0 0 1-1.126 0l-3.636-3.635z" clipRule="evenodd"></path></svg>
                            <input placeholder="검색어를 입력하세요"></input>
                        </div>
                    </section>
                </div>
                <div className="filter-bar">

                </div>
                <div className="myContents">
                    <div className="myContents_">
                        {
                            todolist.slice(0).reverse().map((a)=>{
                                let Y = a.date.split('-')[0]
                                let M = a.date.split('-')[1]
                                let D = a.date.split('-')[2].split('T')[0]

                                let boardActicle;
                                if (a.user_pk.toString() === pgN) {
                                    boardActicle = 
                                        <div className="contents-acticle" key={a.id}>
                                            {
                                                a.image === null || a.image === undefined
                                                ? null
                                                : (
                                                <Link to={"/detail/" + a.id}>
                                                    <div className="acticle-thumbnail">
                                                        <img src={"http://localhost:8000" + a.image} alt="/"></img>
                                                    </div>
                                                </Link>
                                                )
                                            }
                                            <Link to={"/detail/" + a.id}>
                                                <h2>{a.title}</h2>
                                            </Link>
                                            <p>{a.content}</p>
                                            <div className="contents-filter">
                                                {
                                                    a.language.split(',').map((L, i)=>{
                                                        return(
                                                            <>
                                                                <p key={i}>{L}</p>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className="time-info">
                                                <span>{Y + "년 " + M + "월 " + D + "일"}</span>
                                                <div className="separator">·</div>
                                                <span>{a.comment}개의 댓글</span>
                                            </div>
                                        </div>
                                }

                                return(
                                    boardActicle
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Mysite;