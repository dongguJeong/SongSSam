import React, { useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

import "../styles/global.css";
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width : 80%;
  margin-left : 10%;
  padding-top : 80px;
  position : relative;
`;



const Profile = styled.div`
  display : flex;
  margin-bottom : 40px;
  box-shadow : 0px 4px 6px -1px rgb(0,0,0,.3);
  border-radius : 15px;
  padding : 30px;
  background-color : white;

`;


const Square = styled.div`
    width : 200px;
    height : 200px;
    border-radius : 50%;
    background-color : gray;
    margin-right : 100px;
`;

const ProfileCol = styled.div`
    display : flex;
    flex-direction : column;
    
`;

const ProfileTitle = styled.div`
    
  margin-right : 50px;
  h3{
    color : rgba(0,0,0,0.4);

    font-size : 15px;
    margin-bottom : 10px;
  }

  h1{
    font-size : 30px;
  }

  margin-bottom  : 15px;
    
    
`
const ProfileSinger = styled.div`
    h3{
      color : rgba(0,0,0,0.4);
      font-size : 15px;
      margin-bottom : 10px;
    }

    h2{
      font-size : 25px;
    }
`

const ProfileInner = styled.div`
    display : flex;
`



const GenreContainer =styled.div`

`;
const GenreEdit = styled.div`
    display : flex;
    margin-top : 25px;
    margin-bottom : 20px;
    div:first-child {
      font-size : 25px;
    }

    div:last-child{

      color : var(--iconColor);
      margin-left : 5px;
      text-decoration : underline;
      cursor : pointer;
    }

    div:last-child:hover{
      color : #0013de;
    }

`;



const GenreList = styled.div``;

const Genre = styled.div`
    display : grid;
    grid-template-columns : repeat(2, 100px);
    grid-gap : 20px;

    list-style : none;
    font-size : 17px;
    
    svg{
      transform : rotateZ(20deg);
      margin-right : 10px;
    }

`;

const PreferBox = styled(motion.div)`
    position : absolute;
    top : 5%; 
    left : var(--PreferBox-ml);
    width : 800px;
    height : var(--PreferBox-height);
    background: #FFBA46;
    border-radius : 15px;
    box-shadow : 0px 4px 6px -1px rgb(0,0,0,.3);
    padding : 15px;
    overflow : scroll;

`;
const P_container = styled.div``;

const P_header = styled.div`
    display : flex;
    justify-content : space-between;
    width : 100%;
    height : 50px;
    background-color : white;
    border-radius : 15px;
    align-items : center;
    margin-bottom : 20px;
    padding-right : 10px;
    padding-left : 10px;
    box-shadow :  0px 4px 6px -1px rgb(0,0,0,.3);


`;

const P_body = styled.div`

    width : 90%;
  
    display : grid;
    grid-template-columns : repeat(4, 150px);
    grid-gap : 20px;
    margin : 0 auto;
    padding-left : 2%;

`;


const P_header_title = styled.div`


`;

const SF_closeBtn = styled.div`
    width : 30px;
    height : 30px;
    border-radius : 50%;
    color : white;
    background-color : rgba(0,0,0,0.3);
    
    display : flex;
    align-items : center;
    justify-content : center;
    cursor : pointer;

    svg{
        width : 17px;
        height : 17px;
    }
`;


const P_item_container = styled.div<{bgPath : string}>`

    background-color : white;
    display : flex;
    box-shadow : 0px 4px 6px -1px rgb(0,0,0,.3);

    
    align-items: center;
    justify-content : center;
    border-radius : 20px;
    height : 150px;
    align-items : end;
    background-image : url(${prop => prop.bgPath});
    background-size : cover;
    background-position: center;
    

    div{
      text-align : center;
    }

`;

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




function MyPage() {

  const movePage = useNavigate();

  const [edit, setEdit] = useState(false);
  const clickEdit = () => {
    setEdit((cur) => !cur);
  }


  return (<Layout>
    
    <Wrapper>
      <Profile>
        <Square/>
        <ProfileCol>
          <ProfileInner>
          <ProfileTitle>
            <h3>이름</h3>
            <h1>홍길동</h1>
          </ProfileTitle>
          <ProfileSinger> 
            <h3>카카오톡 이메일</h3>
            <h2>qwerty@naver.com</h2>
          </ProfileSinger>
          </ProfileInner>
          <GenreContainer>
            
            <GenreEdit>
              <div>선호장르</div>
            </GenreEdit>
      

            
          </GenreContainer>
        </ProfileCol>   
      </Profile>

      </Wrapper>
      
      
    
  </Layout>
  )
  
}

export default MyPage;