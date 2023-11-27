import React, { useEffect, useState} from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AudioContainer from '../components/AudioContainer';
import BigTitle from '../components/BigTitle';
import axios from 'axios';
import {IProfile,IVocal, IMp3, IData} from '../asset/Interface';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding-left : 40px;
  padding : 0 40px;
`;

const Profile = styled.div`
  width  : 800px;
  display: flex;
  margin-bottom: 40px;
  border : 2px solid var(--iconColor);
  border-radius: 15px;
  padding: 30px;
  background-color: white;
`;

const Square = styled.div<{ bgpath: string }>`
  width: var(--Profile-ImgSize);
  height: var(--Profile-ImgSize);
  border-radius: 5px;
  margin-right: var(--Profile-Margin-right);
  background-position: ${props => (props.bgpath === '/img/user-solid.svg' ? 'center bottom' : 'center')};
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(${props => props.bgpath});
  background-color: ${props => (props.bgpath === '/img/user-solid.svg' ? 'rgba(128, 128, 128, 0.7)' : "transparent")};
  background-blend-mode: multiply;
`;

const ProfileCol = styled.div`
  
`;

const ProfileTitle = styled.div`
  margin-right: 50px;
  padding-top : 5px;
  h3 {
    color: rgba(0, 0, 0, 0.4);
    font-size: 15px;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 20px;
    font-weight : 400;
  }

  margin-bottom: 30px;
`;

const ProfileEmail = styled(ProfileTitle)`
  margin-bottom: 0;
`;

const ProfileInner = styled.div`
  padding-top: 10px;
  display : grid;
  grid-template-columns : repeat(2, 200px);
  
`;

const ProfilePrefer= styled.div`
`

const AudioTitle = styled.div`
  margin-bottom : 20px;
  font-size : 20px;
`

const AudioWrapper = styled.div`
  border  : 2px solid black;
  background : white;
  width : 480px;
  border-radius : 10px;
  margin-bottom : 10px;
`

const Flex = styled.div`
  display : flex;
`
const DeleteBtn = styled.div`
  margin-left : 15px;

  cursor : pointer;
  padding-top : 15px;
  text-align : center;
  font-size : 12px;
  
  color : blue;

  & : hover{
    color : #26c9c3;
  }
  
`

const ProfilePrefer__title = styled.div`
  display : flex;

  h3 {
    color: rgba(0, 0, 0, 0.4);
    font-size: 15px;
    margin-bottom: 10px;
  }

  h5 {
    padding-left  :10px;
    padding-top : 1px;
    color : blue;
    cursor : pointer;
    font-size : 12px;

    &:hover {
      text-decoration : underline;
      color : #26c9c3;
    }
  }
`

const ProfilePrefer__content = styled.div`
  display : grid;
  grid-template-columns : repeat(2, 200px);
  grid-gap : 10px;
`

const ProfilePrefer__content__container = styled.div`
  svg{
    transform : rotate(10deg);
    margin-right : 10px;
  }
`

const AICover__Title = styled(AudioTitle)`
  margin-top : 20px;
`

function MyPage() {
  const [profileData, setProfileData] = useState<IProfile>();
  const [vocalData, setVocalData] = useState<IVocal[]>([]);
  const [wavFile, setWavFile] = useState<IMp3[]>([]);
  const [prefer, setPrefer] = useState<IData[]>([]);

  const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`https://songssam.site:8443/member/info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        setProfileData(data.response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfileData();
  }, [accessToken]);

  // 내가 녹음한 데이터 목록 가져오기
  useEffect(() => {
    const fetchVocalData = async () => {
      try {
        const res = await fetch(`https://songssam.site:8443/member/vocal_list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        setVocalData(data.response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVocalData();
  }, [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('https://songssam.site:8443/member/user_list', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const JSON = await data.json();
        console.log(JSON.response);
        setPrefer(JSON.response);

      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
  
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (vocalData) {
      for (let vocal of vocalData) {
        downloadWavFile(vocal.originUrl , vocal.songId);
      }
    }
  }, [vocalData]);

  const getDuration = async (blob: Blob): Promise<number> => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new (window.AudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  };
  

  const downloadWavFile = async (originUrl: string , songId : number) => {
    try {
      const response = await fetch(`https://songssam.site:8443/member/download?url=${originUrl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
      const blob = await response.blob();
      const duration  = await getDuration(blob);
      setWavFile(prev => [...prev, {mp3 : blob, duration : duration ,songId : songId }]);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  };

  const handleDelete = async(songId : number) => {
    try{
      const res = await axios.post(`https://songssam.site:8443/member/deleteVocalFile?songId=${songId}`,
      {},
        {
          headers : {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      if(res.status === 200){
        const temp = wavFile.filter(i => i.songId !== songId);
        setWavFile(temp);
        alert("삭제를 성공했습니다");
      }
    }
    catch(e){
      alert("삭제를 실패했습니다")
    }    
  }

  const movePage = useNavigate();
  const goPrefer =() => {
    movePage('/prefer');
  }
  const profileImage = profileData?.profileUrl !== undefined ? profileData.profileUrl : '/img/user-solid.svg';

  return (
    <Layout>
      <Wrapper>
        <BigTitle title='내 정보'/>
        <Profile>
          <Square bgpath={profileImage} />
          <ProfileCol>
            <ProfileInner>
              <ProfileTitle>
                <h3>이름</h3>
                <h1>{profileData?.nickname}</h1>
              </ProfileTitle>
              <ProfileEmail>
                <h3>카카오톡 이메일</h3>
                <h1>{profileData?.email}</h1>
              </ProfileEmail>
              <ProfilePrefer>
                <ProfilePrefer__title>
                  <h3>선호 목록 </h3> <h5 onClick={goPrefer}>바꾸기</h5>
                </ProfilePrefer__title>

                <ProfilePrefer__content>
                  {
                    prefer?.map((song,i) => 
                    <ProfilePrefer__content__container key={i}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
                      {song.title.length <= 20 ? song.title : song.title.slice(0,10) + '...' }
                    </ProfilePrefer__content__container>)
                  }
                </ProfilePrefer__content>

              </ProfilePrefer>
            </ProfileInner>
          </ProfileCol>
        </Profile>

        <AudioTitle>
          <span >녹음 목록</span>
        </AudioTitle>
       
        {wavFile
          ? wavFile.map((i, index) => (
            <Flex key = {index}>
              <AudioWrapper key={index}>
                <AudioContainer audioSource={URL.createObjectURL(i.mp3)} clipDurationTime={i.duration}></AudioContainer>
              </AudioWrapper>
               <DeleteBtn onClick={() => handleDelete(i.songId)}>
                <span>삭제</span>
              </DeleteBtn>
            </Flex> 
            ))
          : null}

      </Wrapper>
    </Layout>
  );
}

export default MyPage;
