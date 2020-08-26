import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log("Auth response.payload1", response.payload);
        console.log("Auth 1", response);
        console.log("Auth option1", option);
        console.log("Auth adminRoute1", adminRoute);

        if (!response.payload.isAuth) {
          console.log("Auth response.payload2", response.payload);
          
          if (option) {
            console.log("Auth response.payload3", response.payload);
            console.log("Auth option3", option);
            console.log("Auth adminRoute3", adminRoute);
            console.log("response.payload.isAdmin3", response.payload.isAdmin);
            props.history.replace("/login");
          }
        
        } else if (response.payload.isAuth && !response.payload.isVerified) {
          console.log("Auth response.payload4", response.payload);
          console.log("Auth option4", option);
          console.log("Auth adminRoute4", adminRoute);
          console.log("response.payload.isAdmin4", response.payload.isAdmin);
          props.history.replace("/notconfirmation");
        
        } else {
          
          if (adminRoute && !response.payload.isAdmin) {
            console.log("Auth response.payload5", response.payload);
            console.log("Auth option5", option);
            console.log("Auth adminRoute5", adminRoute);
            console.log("response.payload.isAdmin5", response.payload.isAdmin);
            props.history.replace("/");
          
          } else {
            
            if (option === false) {
              console.log("Auth response.payload6", response.payload);
              console.log("Auth option6", option);
              console.log("Auth adminRoute6", adminRoute);
              console.log("response.payload.isAdmin6", response.payload.isAdmin);
              props.history.replace("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
