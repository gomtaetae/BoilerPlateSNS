import React, { useEffect, useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import auth from "../../../hoc/auth";
import { useSelector } from "react-redux"


function LandingPage(props) {

  //const user = useSelector(state => state.user)
  //console.log("랜딩페이지유저 데이터",user.userData);
  
  const [isAuth, setIsAuth] = useState(false);
  const [isSns, setIsSns] = useState(false)

  useEffect(() => {
    console.log("랜딩페이지");
    axios.get("api/users/auth").then((response) => {
      console.log("랜딩페이지라고 말해주세요", response.data);
      setIsAuth(response.data.isAuth)
      setIsSns(response.data.isSns)
    });
  }, []);
  


  const onClickHandler = () => {
    axios.get("api/users/logout").then((response) => {
      console.log("response.data : ", response.data.success);
      if (response.data.success) {
        alert("로그아웃에 성공했습니다.");
        setIsAuth(false);
        setIsSns(false)
        props.history.replace("/");
      } else {
        alert("로그아웃 하는데 실패 했습니다.");
      }
    });
  };

  const onLogin = () => {
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
        <div>{!isAuth ? <button onClick={onRegister}>회원가입</button>: false}</div>
        <div>{!isAuth ? <button onClick={onLogin}>로그인</button>: false}</div>
        <div>{isAuth ? <button onClick={onClickHandler}> 로그아웃 </button>: false}</div>
        <div>{isAuth&&!isSns ? <button onClick={onMyPage}> 회원수정 </button>: false}</div>
      </span>
    </div>
  );
}

export default withRouter(LandingPage);
