import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

import "../styles/global.css";
import { useSelector } from 'react-redux';
import { getAccessToken } from '../redux/tokenSlice';

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


const Square = styled.div<{bgPath : string}>`
    width : 200px;
    height : 200px;
    border-radius : 50%;
    margin-right : 100px;

    background-position : ${props => (props.bgPath == '/img/user-solid.svg' ? 'center bottom' : 'center')};
    background-repeat : no-repeat;
    background-image :  url(${props => props.bgPath});
    background-color: ${props => (props.bgPath == '/img/user-solid.svg' ?  'rgba(128, 128, 128, 0.7)': "transparent")};
    background-blend-mode: multiply;

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

  margin-bottom  :30px;
    
    
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
    padding-top :30px;
`

interface IProfile {
  id : number,
  email : string,
  nickname : string,
  profileUrl : string ,
  role : string,
}


function MyPage() {

  const [profileData , setProfileData] = useState<IProfile>();

  const AToken = useSelector(getAccessToken);
  console.log(AToken);

  useEffect(() => {
    const fetchData =async () => { 

      try{
        const res = await fetch("http://songssam.site:8080/member/info",
            {
              method : "GET",
              headers : {
                Authorization : `Bearer ${AToken}`,
                Origin : 'http://localhost:3000',
              }
            }
        )

        const data = await res.json();
        setProfileData(data);
        

       }catch(err){
        console.log(err);
       }
      }
    

    fetchData();

  },[AToken])
  
  const profileImage = profileData?.profileUrl !== undefined ? profileData.profileUrl : '/img/user-solid.svg';


  return (<Layout>
    
    <Wrapper>
      <Profile>
        <Square bgPath = {profileImage}/>
        <ProfileCol>
          <ProfileInner>
          <ProfileTitle>
            <h3>이름</h3>
            <h1>정동구</h1>
          </ProfileTitle>
          <ProfileSinger> 
            <h3>카카오톡 이메일</h3>
            <h2>naver.com</h2>
          </ProfileSinger>
          </ProfileInner>
          
        </ProfileCol>   
      </Profile>

      </Wrapper>
      
      
    
  </Layout>
  )
  
}

export default MyPage;