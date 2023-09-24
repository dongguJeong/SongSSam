import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

import "../styles/global.css";
import { useSelector } from 'react-redux';
import serverURL from '../asset/Url';
import { RootState } from '../redux/store';

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


const Square = styled.div<{bgpath : string}>`
    width : 200px;
    height : 200px;
    border-radius : 50%;
    margin-right : 100px;

    background-position : ${props => (props.bgpath === '/img/user-solid.svg' ? 'center bottom' : 'center')};
    background-repeat : no-repeat ; 
    background-size : cover;
    background-image :  url(${props => props.bgpath});
    background-color: ${props => (props.bgpath === '/img/user-solid.svg' ?  'rgba(128, 128, 128, 0.7)': "transparent")};
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

interface IVocal {
  id : null,
  awsUrl : string,
  spectr : [],
  createdAt : string,
  user : null,
}



function MyPage() {

  const [profileData , setProfileData] = useState<IProfile>();
  const [vocalData , setVocalData] = useState<IVocal[] >([]);
  const [wavFile, setWavFile] = useState<Blob[] >([]);

  const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);
  const vocalDownlodUrl = 'https://songssam.site:8443/member/download?url=user/'

  //프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfileData =async () => { 

      try{
        const res = await fetch(`https://${serverURL}/member/info`,
            {
              method : "GET",
              headers : {
                Authorization : `Bearer ${accessToken}`,
                
              }
            }
        )

        const data = await res.json();
        setProfileData(data.response);
      

       }catch(err){
        console.log(err);
       }
      }
    

    fetchProfileData();

  },[accessToken])


  //내가 녹음한 데이터 목록 가져오기
  useEffect(() => {
    const fetchVocalData =async () => { 

      try{
        const res = await fetch(`https://${serverURL}/member/vocal_list`,
            {
              method : "GET",
              headers : {
                Authorization : `Bearer ${accessToken}`,
                
              }
            }
        )

        const data = await res.json();
        setVocalData(data);
        

        if(vocalData) {
          for(let vocal of vocalData) {
             const parsing = vocal.awsUrl.split("/");
             const fileName = parsing[parsing.length-1];
             const downloadUrl = vocalDownlodUrl + `${fileName}`
             downloadWavFile(downloadUrl);
          }
        }


       }catch(err){
        console.log(err);
       }
      }
    

    fetchVocalData();

  },[accessToken]);



  const downloadWavFile = async (downloadURL : string ) => {
    try {
      const response = await fetch(vocalDownlodUrl +`${downloadURL}`); 
      const blob = await response.blob();
      setWavFile((prev) => [...prev, blob]);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  };


  useEffect(() => {
    console.log("vocalList : ", vocalData);
    console.log("wavFile : ", wavFile);
  },[wavFile,vocalData]);
  
  const profileImage = profileData?.profileUrl !== undefined ? profileData.profileUrl : '/img/user-solid.svg';


  return (<Layout>
    
    <Wrapper>
      <Profile>
        <Square bgpath = {profileImage}/>
        <ProfileCol>
          <ProfileInner>
          <ProfileTitle>
            <h3>이름</h3>
            <h1>{profileData?.nickname}</h1>
          </ProfileTitle>
          <ProfileSinger> 
            <h3>카카오톡 이메일</h3>
            <h2>{profileData?.email}</h2>
          </ProfileSinger>
          </ProfileInner>
          
        </ProfileCol>   
      </Profile>

      </Wrapper>
      
      {
        wavFile ? 
        
        wavFile.map((i, index) => (
          <div key={index}>
            <audio controls>
              <source src={URL.createObjectURL(i)} type='audio.wav'></source>

            </audio>
          </div>
          
        ))


        : null
      }
    
  </Layout>
  )
  
}

export default MyPage;