import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../../css/Board.css';

function Board(){
    let [filterList] = useState([{id : 1, language: 'Python'}, {id : 2, language : 'React'},
    {id : 3, language : 'Java'}, {id : 4, language :'C#'}, {id : 5, language:'C'},
    {id : 6, language:'C++'}, {id : 7, language:'GO'}, {id : 8, language:'Javascript'}])
    let [languagefilterList, setLanguageilterList] = useState("");
    
    let [todolist, setTodoList] = useState([]);
    let [commentCount, setCommentCount] = useState([]);
    let [reCommentCount, setReCommentCount] = useState([]);

    let pgN = document.location.href.split('/')[3]
    useEffect(()=>{
        pgN === "like"
        ?(
            fetch('http://localhost:8000/api/Todos/like/')
            .then((res)=>res.json())
            .then((posts)=>{
                setTodoList(posts)
            })
        )
        :(
            fetch('http://localhost:8000/api/Todos/')
            .then((res)=>res.json())
            .then((posts)=>{
                setTodoList(posts)
            })
        )
    },[pgN])
    
    useEffect(()=>{
        fetch('http://localhost:8000/api/CommentTodos/')
        .then((res)=>res.json())
        .then((posts)=>{
            let arr = [...commentCount]
            posts.map((a)=>{
                arr.push(a.todo_pk)
                setCommentCount(arr)
                return null;
            })
        })
    },[])
    
    useEffect(()=>{
        fetch('http://localhost:8000/api/ReCommentTodos/')
        .then((res)=>res.json())
        .then((posts)=>{
            let arr = [...reCommentCount]
            posts.map((a)=>{
                arr.push(a.todo_pk)
                setReCommentCount(arr)
                return null;
            })
        })
    },[])

    const ClickFilter = (lang)=>{
        let Num = 0;
        let List = [...languagefilterList];

        List.map((a)=>{
            if (a === lang) {
                Num = 1;
            }
            return Num;
        })

        if (Num === 0) {
            List.push(lang)
        }else{
            List.splice(List.indexOf(lang),1)
        }
        setLanguageilterList(List)
    }

    return(
        <div className="trend-section">
            <main className="trend-main">
                <div className="main-section">
                        {
                            todolist.slice(0).reverse().map((a)=>{
                                let Y = a.date.split('-')[0]
                                let M = a.date.split('-')[1]
                                let D = a.date.split('-')[2].split('T')[0]
                                let boardFilterArticle;
                                let Num;
                                let list =  a.language.split(',')

                                if(languagefilterList.length !== 0){
                                    languagefilterList.map((c)=>{
                                        if(list.indexOf(c) !== -1 && Num !== 0){
                                            Num = 1;
                                        }else{
                                            Num = 0;
                                            return Num;
                                        }
                                        return Num;
                                    })
                                    if(Num === 1){
                                        boardFilterArticle = 
                                        <div className="article" key={a.id}>
                                            {
                                                a.image === null
                                                ? null
                                                :(
                                                    <Link to={"/detail/" + a.id}>
                                                        <div className="arcticle-img">
                                                            <img src={"http://localhost:8000" + a.image} alt=""></img>
                                                        </div>
                                                    </Link>
                                                )
                                            }
                                            <div className="article-content">
                                                <Link to={"/detail/" + a.id}>
                                                    <h4>{a.title}</h4>
                                                    <div className="desc-wrapper">
                                                        <p>{a.content}</p>
                                                    </div>
                                                </Link>
                                                <div className="sub-info">
                                                    <span>{Y + "년 " + M + "월 " + D + "일"}</span>
                                                    <span className="separator">·</span>
                                                    <span>{commentCount.filter(n => n === a.id).length + reCommentCount.filter(n => n === a.id).length}개의 댓글</span>
                                                </div>
                                                <div className="filter-info">
                                                {
                                                    list.map((L, i)=>{
                                                        return(
                                                            <p key={i}>{L}</p>
                                                        )
                                                    })
                                                }
                                            </div>
                                            </div>
                                            <div className="article-footer">
                                                <Link to={"/mysite/" + a.user_pk}>
                                                    <img src={a.profileImage} alt=""></img>
                                                    <span>"by " <b>{a.username}</b></span>
                                                </Link>
                                                <div className="likes">
                                                    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                                                    {a.like}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                }else{
                                    boardFilterArticle = 
                                    <div className="article" key={a.id}>
                                        {
                                            a.image === null
                                            ? null
                                            :(
                                                <Link to={"/detail/" + a.id}>
                                                    <div className="arcticle-img">
                                                        <img src={"http://localhost:8000" + a.image} alt=""></img>
                                                    </div>
                                                </Link>
                                            )
                                        }
                                        <div className="article-content">
                                            <Link to={"/detail/" + a.id}>
                                                <h4>{a.title}</h4>
                                                <div className="desc-wrapper">
                                                    <p>{a.content}</p>
                                                </div>
                                            </Link>
                                            <div className="sub-info">
                                                <span>{Y + "년 " + M + "월 " + D + "일"}</span>
                                                <span className="separator">·</span>
                                                <span>{commentCount.filter(n => n === a.id).length + reCommentCount.filter(n => n === a.id).length}개의 댓글</span>
                                            </div>
                                            <div className="filter-info">
                                                {
                                                    list.map((L, i)=>{
                                                        return(
                                                            <p key={i}>{L}</p>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="article-footer">
                                            <Link to={"/mysite/" + a.user_pk}>
                                                <img src={a.profileImage} alt=""></img>
                                                <span>"by " <b>{a.username}</b></span>
                                            </Link>
                                            <div className="likes">
                                                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                                                {a.like}
                                            </div>
                                        </div>
                                    </div>
                                }
                                
                                return(
                                    boardFilterArticle
                                )
                            })
                        }
                </div>
            </main>
            <aside className="pDRpR">
            <div className="eyrfCG">
                <div className="filter__head">
                </div>
                <section>
                <ul>
                    {
                    filterList.map((a)=>{
                        return(
                        <li key={a.id}>
                            <input id={a.language} className="filters-input__checkbox" value="action" type="checkbox" data-type="genres"></input>
                            <label className="input__label | filters-input__label--checkbox" htmlFor={a.language} onClick={()=>{ClickFilter(a.language)}}>
                            <span>{a.language}</span>
                            <span className="filters-input__tick">
                                <svg focusable="false" aria-hidden="true">
                                <use xlinkHref="#check">
                                    <svg viewBox="0 0 24 24" id="check" xmlns="http://www.w3.org/2000/svg"><path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436L24 5.782z"></path></svg>
                                </use>
                                </svg>
                            </span>
                            </label>
                        </li>
                        )
                    })
                    }
                </ul>
                </section>
            </div>  
            </aside>
        </div>
    )
}
export default Board;