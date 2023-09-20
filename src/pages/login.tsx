import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setAccessToken, setRefreshToken } from "../redux/tokenSlice";
import { useDispatch } from 'react-redux';


const Wrapper = styled.div`
    width : 100vw;
    height : 100vh;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color : ${prop => prop.theme.iconColor};
`

const Circle = styled.div`
    width: 48px;
    height: 48px;
    border-radius : 50%;
    border: 5px solid #FFF;
    border-bottom-color: #FF3D00;
    animation: rotation 1s linear infinite;

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
`

const server = "songssam.site:8080";

export default function Redirect(){

    const movePage = useNavigate();
    const dispatch = useDispatch();

    const kakaoLogin = async(code : string | string[] | undefined) => {

        try {
          const res = await axios.post(`http://${server}/auth/login`, 
          {
          "authorizationCode": code // 코드를 요청의 본문에 추가

          }, );


          console.log("생성 : ", res.data); 
          

          dispatch(setAccessToken(res.data.response.accessToken));
          dispatch(setRefreshToken(res.data.response.refreshToken));
          
          

          movePage("/");
          
        } catch (err) {
          console.log("소셜로그인 에러", err);
          window.alert("로그인에 실패했습니다.");
          movePage("/");
        }
      };

        useEffect(()=> {

        let code = new URL(window.location.href).searchParams.get("code"); 
        
        if(code){
            console.log(code);
            kakaoLogin(code);
        }
        else{
            movePage("/");
        }
        },[kakaoLogin]);

    
    return (
       <Wrapper>
            <Circle/>
       </Wrapper>

    )
}