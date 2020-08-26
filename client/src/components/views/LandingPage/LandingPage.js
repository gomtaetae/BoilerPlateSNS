import React, { useEffect, useState, Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import auth from "../../../hoc/auth";
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../../../_actions/user_action";

function LandingWrapper (props){
  const userData = useSelector(state => state.user.userData)
  console.log("이게 렌딩페이지 감싼다",userData);
  return (
  <>
    {userData !==undefined  &&<LandingPage userData={userData} props={props}></LandingPage>}
  </>
  );
}



function LandingPage({props, userData}) {
  let dispatch = useDispatch();

  console.log("랜딩페이지유저 데이터",userData);
  
  const onClickHandler = () => {
        dispatch(logoutUser())
        .then(response => {
          console.log("이거다ㅏ닫다", response.payload);
          if(response.payload.success){
            alert("로그아웃에 성공했습니다.");
            props.history.push('/')
          } else {
            alert("로그아웃 하는데 실패 했습니다.");
          }
        })
  };

  const onLogin = () => {
    console.log(userData.isAuth);
    props.history.push("/login");
  };

  const onRegister = () => {
    props.history.push("/register");
  };

  const onMyPage = () => {
    props.history.push("/mypage");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <span>
        <h2>LandingPage</h2>
        <div>{!userData.isAuth ? <button onClick={onRegister}>회원가입</button>: false}</div>
        <div>{!userData.isAuth ? <button onClick={onLogin}>로그인</button>: false}</div>
        <div>{userData.isAuth ? <button onClick={onClickHandler}> 로그아웃 </button>: false}</div>
        <div>{userData.isAuth&&!userData.isSns ? <button onClick={onMyPage}> 회원수정 </button>: false}</div>
      </span>
    </div>
  );
}

export default withRouter(LandingWrapper);

