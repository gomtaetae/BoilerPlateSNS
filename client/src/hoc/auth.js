import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log("Auth response.payload", response.payload);
        console.log("Auth ", response);
        console.log("Auth option", option);
        console.log("Auth adminRoute", adminRoute);

        if (!response.payload.isAuth) {
          console.log("Auth response.payload", response.payload);
          
          if (option) {
            console.log("Auth response.payload", response.payload);
            console.log("Auth option", option);
            console.log("Auth adminRoute", adminRoute);
            console.log("response.payload.isAdmin", response.payload.isAdmin);
            props.history.replace("/login");
          }
        
        } else if (response.payload.isAuth && !response.payload.isVerified) {
          console.log("Auth response.payload", response.payload);
          console.log("Auth option", option);
          console.log("Auth adminRoute", adminRoute);
          console.log("response.payload.isAdmin", response.payload.isAdmin);
          props.history.replace("/notconfirmation");
        
        } else {
          
          if (adminRoute && !response.payload.isAdmin) {
            console.log("Auth response.payload", response.payload);
            console.log("Auth option", option);
            console.log("Auth adminRoute", adminRoute);
            console.log("response.payload.isAdmin", response.payload.isAdmin);
            props.history.replace("/");
          
          } else {
            
            if (option === false) {
              console.log("Auth response.payload", response.payload);
              console.log("Auth option", option);
              console.log("Auth adminRoute", adminRoute);
              console.log("response.payload.isAdmin", response.payload.isAdmin);
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
