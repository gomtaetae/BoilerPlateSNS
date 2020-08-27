import React, { useState, useEffect } from "react";
import axios from 'axios'
import { withRouter} from 'react-router-dom'
// import Dropzone from "react-dropzone";  //다운 받기

import { useDispatch } from "react-redux";
import { checkPass } from "../../../_actions/user_action";

function DeletePage(props) {

  const dispatch = useDispatch();

  const [Password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("")

  const [currentEmail, setEmail] = useState("");

  useEffect(() => {
    axios.get("api/users/auth").then((response) => {
      console.log("Delete라고 말해주세요", response.data);
        if(!response.data.isAuth){
          alert("회원정보를 가져오지 못했습니다")
          props.history.replace("")
        } else {
          console.log("response.data에 들어옴")
          setEmail(response.data.email)
          setCurrentPassword(response.data.password) //?
          console.log("이거냐냐냐ㅏㄴㄴ",response.data.password);
          console.log("아미녀 이거냐냐냐ㅏㄴㄴ",currentPassword);
          console.log(response.data)
        } 
    });
  }, []);

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    
    let pass = {
      email: currentEmail,
      password: Password
    }

    dispatch(checkPass(pass))
    .then((response) => {
      console.log("비번 맞냐", response);
      console.log("비번 맞냐2", response);
      if(response.payload.success){
        axios.post('/api/users/del')
        .then((response) => {
          console.log("지울꺼야ㅑㅑㅑㅑ",response);
        })
        
        alert("회원정보가 삭제되었습니다.");
        props.history.replace("/");
      } else{
        
        alert("비밀번호가 틀립니다.")
  
        
      }
    })
  
  };
  



  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems:'center'
      ,width: '100%', height: '100vh'
    }}>
      <form style={{display:'flex', flexDirection: 'column'}}
          onSubmit={onSubmitHandler}
      >

        <label>Email</label>
        <input type="email" value={currentEmail} onChange={onEmailHandler}></input>

        <label>PassWord</label>
        <input type="password" value={Password} onChange={onPasswordHandler} placeholder=""/>

        <br/>

        <button type="submit">
          회원탈퇴
        </button>
      </form>
    </div>
  )
}

export default withRouter(DeletePage)
