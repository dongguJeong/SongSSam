import React, { useEffect, useState,useRef } from 'react';
import Layout from '../components/Layout';
import { styled } from 'styled-components';
import "../styles/global.css";
import PerfectScore from '../components/PerfectScore';
import { useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import UploadFormat from '../components/UploadFormat';

const Wrapper = styled.div` 
  width : 80%;
  margin-left : 10%;
  padding-top : 80px;
  
`

const Container = styled.div`
    width : 100%;
   

`;

const SongContainer = styled.div`
    display : flex; 
    margin-bottom  : 20px;

    @media screen and (max-width : 890px){
        display : block;
    }
`;

const SongInfoContainer = styled.div`
    display  : flex;
    justify-content : start;
`

const SongImg = styled.img`
    width : 270px;
    height : 270px;
    background-color : gray;
    border-radius : 10px;
    margin-right : 50px;
`;

const SongCol = styled.div`
    display : flex;
    flex-direction : column;
    width : 100%;

    @media screen and (max-width : 900px){
        margin-top : 10px;
        align-self : initial;
        align-items : center;
        justify-content : center;
    }  
`;


const SongInfoContainerTop = styled.div`
    padding-top : 100px;
    margin-bottom : 80px;

    @media screen and (max-width : 890px){
        padding-top : 10px;
        margin-bottom : 10px;
    }
`


const SongTitle = styled.div`
    font-size : 26px;
    font-weight : 600;
    margin-bottom : 10px;
    display : flex;
`
const Singer = styled.div`
    font-size : 26px;
    color : var(--iconColor);
    cursor : pointer;
    display : flex;
    
    &:hover{
      text-decoration : underline;
        text-decoration-color: inherent;
        text-decoration-skip: spaces;
        text-underline-offset: 5px; 
        text-decoration-thickness: 2px;  
    }
`

const PlayBtnContainer = styled.div`
    cursor : pointer;
`

const PlayBtn = styled.div`
    width : 80px;
    height : 30px;
    background-color : var(--iconColor);
    border-radius : 5px;
    font-size :  14px;
    color :white;
    padding-top : 8px;
    padding-left : 14px;
`

const SampleButton = styled.div`
    margin : auto; 
    margin-top : 20px;
    
    text-align : center;
    font-size : 25px;
    width : 100%;
    padding-top : 10px;
    padding-bottom : 10px;
    background-color : #F6BA42;
    color : black;
    border-radius : 10px;
    
    flex-shrink : 1;
    cursor : pointer;

    &:hover{
        text-decoration : underline;
        text-decoration-color: inherent;
        text-decoration-skip: spaces;
        text-underline-offset: 5px; 
        text-decoration-thickness: 2px;

    }
`
const AlertContainer = styled(SampleButton) `
    display: none;

    @media screen and (max-width : 890px){
        display : block;
    }
`

const Square = styled.div`
    width : 130px;
    height : 130px;
    border-radius : 10px;
    background-color : gray;
`

const OtherContainer = styled.div`
    margin-top : 100px;
`

const OtherTitle = styled.div`
    font-size : 20px;
    margin-bottom  : 20px;
`
const OtherListContainer = styled.div`
    display : grid;
    grid-template-columns : repeat(4,130px);
    grid-gap : 30px;
`
const OtherList = styled.div``;

const OtherCol = styled.div`
    margin-top : 20px;
    margin-bottom : 50px;
`;

const PerfectScoreContainer = styled.div`
    margin-top : 10px;
    display : block;
    @media screen and (max-width : 890px){
        display : none;
    }
`

const UploadLabel = styled.label`
    width : 80px;
    height : 30px;
    background-color  : red;
    color : white;
    font-size : 13px;
    padding-top : 9px;
    padding-left : 11px;
    border-radius : 5px;
    margin-left : 10px;
    cursor : pointer;
`;

const UploadInput = styled.input`
    display : none;
`;

const FFlex = styled.div`
    display : flex;
`

export default function Detail() {

    const {title, singer,imgUrl,songId} = useParams();
    const [perfect,setPerfect] = useState(false);
    const [play , setPlay] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [up, setUp] = useState(false);

    const handlePerfect = () => {
        setPerfect((cur) => !cur);
    }

    const handleUp = () => {
        setUp((cur) => !cur);
    }

    useEffect(() => {

        const handleDownloadMp3 = async () => {
            try {
              const URL = `https://songssam.site:8443/song/download?url=origin/21dc6515-eb25-4cf7-abe8-5f5d585a8a4e`;
              const newAudio = new Audio(URL);
              audioRef.current = newAudio;

              return () => {
                newAudio.pause();
                newAudio.src = '';
              };
            } catch (error) {
              console.error('Error fetching MP3:', error);
              return Promise.reject(error);
            }
          };
      
          handleDownloadMp3();

          return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
          };

    },[]);

    const handlePlay = () => {
        if(audioRef.current){
            setPlay(prev => !prev);
            if(!play){
                audioRef.current.pause();
            }
            else{
                audioRef.current.play();
            }
        }
    };
    
   
  return (
  <Layout>
     <Wrapper>
       <Container>
        <SongContainer>
            <SongImg src={imgUrl} alt='Song Image'/>
            <SongInfoContainer>
                <SongCol>
                    <SongInfoContainerTop>
                        <SongTitle>
                            <span>{title}</span>
                        </SongTitle>
                        <Singer>
                            <Link to ={`/search/${singer}`}>
                                <span>{singer}</span>
                            </Link>
                        </Singer>
                    </SongInfoContainerTop>
                    <PlayBtnContainer>
                    <FFlex> 
                        <PlayBtn onClick={handlePlay}>노래 듣기</PlayBtn>
                        
                        <UploadLabel>
                            <span>노래 업로드</span>
                            <UploadInput type='file' accept='audio/mpeg'/>
                        </UploadLabel>
                    </FFlex>  

                </PlayBtnContainer>
                </SongCol>
                
            </SongInfoContainer>
        </SongContainer>
        


        <SampleButton>
                    <span>샘플링이 필요합니다</span> 
        </SampleButton>
        <SampleButton onClick={handlePerfect}>
                    <span>퍼펙트 스코어</span> 
        </SampleButton>

        <SampleButton onClick={handleUp}>
                    <span>파일 업로드가 필요합니다</span> 
        </SampleButton>
        {
            perfect &&
            <PerfectScoreContainer > 
                    <AlertContainer> <span>화면이 좁습니다</span> </AlertContainer>
                    <PerfectScore songId = {songId}/>
            </PerfectScoreContainer>
        }

        <div style={{marginTop : '10px'}}>
        {
            up && <UploadFormat Id={Number(songId)}/>
        }
        </div>
        
        <OtherContainer>
            <OtherCol>
            <OtherTitle>추천 곡</OtherTitle>
            <OtherListContainer>
                {
                    [1,2,3,4].map((_,i) => <OtherList key={i}>
                        <Square />
                    </OtherList>
                    )
                }
            </OtherListContainer>
            </OtherCol>
        </OtherContainer>
       </Container>
        
        
    </Wrapper>
   
  </Layout>
  )
  
};

