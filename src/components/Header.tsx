import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import {KAKAO_AUTH_URL} from "../components/KaKao";

import "../styles/global.css";
import { useNavigate } from 'react-router-dom';


const Wrapper = styled.div`
  background-color :  white;
  height : 55px;
  width : calc( 100vw - var(--navigation-width) );
  color : black;
  position : fixed;
  top : 0;
  right : 0;
  z-index: 1;
  box-shadow : 0px 4px 6px -1px rgb(0,0,0,.3);

  
`;


const Container = styled.div`
  font-size : 10px;
  width : 100%;
  padding : 10px 20px;
  height :  100%;
  display : flex;
  font-size : 20px;
  justify-content : space-between;
  align-items : center;
  

`

const HeaderTitle = styled.span`
  font-family : "ingrid_darling";
  font-size : 30px;
`


const Column = styled.div`
  display : flex;
  align-items : center;
  cursor : pointer;
  font-size : 15px;
`;  



const LinkContainer = styled.ul`
  display : flex;

  
` 
const LoginBtn = styled.div`

  color : white;
  background-color: var(--bgColor);
  padding : 7px 15px;
  border-radius : 5px;
  font-size : 15px;
  border : 1px solid white;

`



const LoginContainer = styled(motion.div)`

  width : 300px;
  height : 400px;
  background-color : white  ;
  position : fixed;
  box-shadow : 1px 1px 5px 1px  rgba(0,0,0,0.2);
  
  top : 25%;
  left : 45%;
  border-radius : 10px;
  border : 1px solid var(--iconColor);
  
`

const loginVars = {
  invisible : {
    y : 30,
    opacity : 0,
    
    transition : {
      type : "tween",
      duration : 0.5
    }
  },

  visible : {
    y : 0,
    opacity : 1,

    transition : {
      type : "tween",
      
    }
    
  },

  exit : {
    y : 30,
    opacity : 0,
   
    transition : {
      duration : 0.8
    }
  }

}

const LoginInnerContainer = styled.div`
  display : flex;
  flex-direction : column;
  align-items : center;
  padding-top : 100px;
  position : relative;

  img{
    width : 100px;
    height : 100px;
    margin-bottom : 80px;
  }

`;



const KaKaoBtn = styled.form`

  position : relative;
  width : 250px;
  height : 45px;
  background-color : #FAE100 ;
  color : #181600;
  cursor : pointer;
  border-radius : 10px;

  
`;

const KaKaoBtnContainer = styled.div`

  
  width : 100%;
  height : 100%;
 

  a{
    width : 100%;
    height : 100%;
    display : flex;
    justify-content : center;
    align-items : center;
    padding-left : 10px;
  }
  
  div{
    width : 100%;
    height : 100%;
    display :flex;
    padding-left : 20px;
    align-items : center;
    justify-content : center;
    
  
  }`;

const KaKaoSvg = styled.svg`

  position : absolute ;
  left : 15px;
  top : 7px;
  width : 30px;
  height : 30px;
  
  
`;

const CloseBtn = styled.div`
  position : absolute ;
  top : 5px;
  right : 5px;
  width : 30px;
  height : 30px;
  display : flex;
  justify-content : center;
  align-items : center;
  background-color : rgba(0,0,0,0.2);
  border-radius : 50%;
  cursor : pointer;

  svg{
  border-radius : 50%;
  width : 15px;
  height : 15px;
  }

`


function MainHeader() {



  const movePage = useNavigate();
  const [click, setClick] = useState(false);

  const clickLogin = () =>{
    setClick((cur) => !(cur));
  }

  
  const clickLogout = () => {
    movePage("/");
  }


  return <> 

    <Wrapper>
      <Container>
        <Column>
          <LinkContainer>
          </LinkContainer>
        </Column>
        <Column >
          <LoginBtn >로그인</LoginBtn>
        </Column>
      </Container>

      <AnimatePresence>
        { 
          click && 
          <LoginContainer variants={loginVars} initial = "invisible" animate="visible" exit ="exit">

            <LoginInnerContainer >

              <CloseBtn onClick={clickLogin}>
              <svg xmlns="http://www.w3.org/2000/svg" fill='white'  viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
              </svg>
              </CloseBtn>

              <img alt='로고' src='/img/music_note.png'/>

              <KaKaoBtn>
                <KaKaoBtnContainer>

              <KaKaoSvg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512">
                <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/>
              </KaKaoSvg>
                <a href={KAKAO_AUTH_URL}>카카오톡으로 로그인</a>
                </KaKaoBtnContainer>
              </KaKaoBtn>

            </LoginInnerContainer>
          </LoginContainer>
        
        
      }
      </AnimatePresence>
    </Wrapper>

  </>
   
   
  
}

export default MainHeader;