import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

import "../styles/global.css";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AudioContainer from '../components/AudioContainer';

const Wrapper = styled.div`
  width: 80%;
  margin-left: 10%;
  padding-top: 80px;
  position: relative;
`;

const Profile = styled.div`
  display: flex;
  margin-bottom: 40px;
  box-shadow: 0px 4px 6px -1px rgb(0, 0, 0, .3);
  border-radius: 15px;
  padding: 30px;
  background-color: white;
`;

const Square = styled.div<{ bgpath: string }>`
  width: var(--Profile-ImgSize);
  height: var(--Profile-ImgSize);
  border-radius: 50%;
  margin-right: var(--Profile-Margin-right);

  background-position: ${props => (props.bgpath === '/img/user-solid.svg' ? 'center bottom' : 'center')};
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${props => props.bgpath});
  background-color: ${props => (props.bgpath === '/img/user-solid.svg' ? 'rgba(128, 128, 128, 0.7)' : "transparent")};
  background-blend-mode: multiply;
`;

const ProfileCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileTitle = styled.div`
  margin-right: 50px;
  h3 {
    color: rgba(0, 0, 0, 0.4);
    font-size: var(--Profile-Title-grayFontSize);
    margin-bottom: 10px;
  }

  h1 {
    font-size: var(--Profile-Title-NamefontSize);
  }

  margin-bottom: 30px;
`;

const ProfileEmail = styled(ProfileTitle)`
  margin-bottom: 0;
  h1 {
    font-size: var(--Profile-Title-EmailfontSize);
  }
`;

const ProfileInner = styled.div`
  padding-top: var(--Profile-Padding-Top);
`;

interface IProfile {
  id: number;
  email: string;
  nickname: string;
  profileUrl: string;
  role: string;
}

interface IVocal {
  id: null;
  awsUrl: string;
  spectr: [];
  createdAt: string;
  user: null;
}

function MyPage() {
  const [profileData, setProfileData] = useState<IProfile>();
  const [vocalData, setVocalData] = useState<IVocal[]>([]);
  const [wavFile, setWavFile] = useState<Blob[]>([]);
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
    if (vocalData) {
      for (let vocal of vocalData) {
        console.log(vocal.awsUrl);
        downloadWavFile(vocal.awsUrl);
      }
    }
  }, [vocalData]);

  const downloadWavFile = async (awsUrl: string) => {
    try {
      const response = await fetch(`https://songssam.site:8443/member/download?url=${awsUrl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const blob = await response.blob();
      setWavFile(prev => [...prev, blob]);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  };

  const profileImage = profileData?.profileUrl !== undefined ? profileData.profileUrl : '/img/user-solid.svg';

  return (
    <Layout>
      <Wrapper>
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
            </ProfileInner>
          </ProfileCol>
        </Profile>
      </Wrapper>
      {wavFile
        ? wavFile.map((i, index) => (
            <div key={index}>
              

              <audio controls>
                <source src={URL.createObjectURL(i)} type='audio/wav'></source>
              </audio>
            </div>
          ))
        : null}
    </Layout>
  );
}

export default MyPage;
