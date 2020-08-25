import React, { useEffect } from "react";
import axios from 'axios'
import { withRouter} from 'react-router-dom'

function Confirmation(props) {


  useEffect(() => {
    axios.get(`/api/users/getConfirmation`)
    .then(response => {
      console.log(response.data)
      if(response.data.success){
        alert("인증이 완료되었습니다.")
        props.history.push("/")
      } else {
        alert("비정상적인 경로입니다.")
        props.history.push("/")
      }
    })
  },[]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems:'center'
      ,width: '100%', height: '100vh'
    }}>      
    <p>confirmation</p><br/>
    </div>
  )
}

export default withRouter(Confirmation)
