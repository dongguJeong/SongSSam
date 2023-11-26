import React, { useEffect, useState,useRef } from 'react';
import Layout from '../components/Layout';
import { styled } from 'styled-components';
import "../styles/global.css";
import PerfectScore from '../components/PerfectScore';
import {useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import UploadFormat from '../components/UploadFormat';
import { useSelector } from 'react-redux';
import { RootState} from '../redux/store';
import { IAI, IData} from '../asset/Interface';
import { MakeString } from '../asset/functions';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Wrapper = styled.div` 
  margin : 0 auto;
  padding : 0 40px;
  padding-top : 60px;
`

const Container = styled.div`
    width : 100%;
`;

const SongContainer = styled.div`
    display : flex; 
    
    margin-bottom  : 50px;

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

    &:hover{
        text-decoration : underline;
    }
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
   
`

const OtherContainer = styled.div`
    
`

const OtherTitle = styled.div`
    font-size : 20px;
`
const OtherListContainer = styled.div`
    display : grid;
    grid-template-columns : repeat(3,130px);
    grid-gap : 100px;
`
const OtherList = styled.div<{bgpath : string}>`
    background-image: url(${props => props.bgpath});
    background-size : contain;
    background-repeat : no-repeat;
    cursor : pointer;
    position : relative;
    overflow : hidden ;
    border-radius : 10px;
`;

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



const OtherList__title = styled.div`
    position : absolute 
    bottom : -20px;
    left : 0px;
    text-align : center;
    padding-top : 10px;
    font-size : 12px;

`

const PerfectBtn = styled(PlayBtn)`
    color : white;
    background-color : black;
    padding : 0;
    text-align : center;
    padding-top: 8px;
    margin-left  :10px;
`

const AIBtn = styled(PlayBtn)`
    background-color : green;
    padding : 0;
    text-align : center;
    padding-top : 8px;
    margin-left : 10px;
    width : 110px;
`

const AIContainer = styled.div`
    position : fixed;
    top : 70px;
    left : 28%;
    width : 700px;
    min-height : 500px;
    background-color : white;
    border-radius : 10px;
    z-index : 2;
    border : 2px solid blue;
    padding : 20px 20px;
`

const Overlay = styled.div`
  position : fixed;
  top : 0;
  left : 0;
  width : 100%;
  height : 100%;
  background-color : transparent;
  cursor : pointer;
  
`

const AIContainer__Title = styled.div`
    font-size : 20px;
    width : 100%;
    position : relative;
    margin-bottom : 20px;
`

const AIContainer__Grid = styled.div`
    display : grid;
    grid-template-columns : repeat(3, 1fr);
`

const AIContainer__Grid__Container = styled.div`
    border : 1px dashed var(--iconColor);
    height : 240px;
`

const AIContainer__Grid__Container__flex = styled.div`
    display : flex;
    height : 100%;
    width : 100%;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`

const AI_Img = styled.div`
    width : 100px;
    height : 100px;
    border-radius : 50%;
    background-color : red;
    margin-bottom : 50px;
`

const AI_NAME = styled.div`
    font-size : 15px;
`

const CloseBtn = styled.div`
  position : absolute ;
  top : -5px;
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

const WholeWrapper = styled.div`
  position : fixed;
  top : 0;
  left : 0;
  width : 100vw;
  height : 100vh;
  background-color : rgba(133, 133, 133,0.5);
  z-index : 2
`

export default function Detail() {

    const {title, singer,imgUrl,songId, originUrl,instUrl} = useParams();
    const [perfect,setPerfect] = useState(false);
    const [play , setPlay] = useState(false);
    const [audioSource , setAudioSource] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [loading, setLoading] = useState(true); 
    const [recommendList , setRecommendList] = useState<IData[] | null>(null);
    const [AI, setAI] = useState(false);
    const [AIData,setAIData] = useState<IAI[]>([]);
    const [targetAI, setTargetAI] = useState(null);

    const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);
    const movePage = useNavigate();

    const handlePerfect = () => {
        setPerfect((cur) => !cur);
    }
    const handleAI = () => {
        setAI((cur) => !cur);
    }

    const closeAI =()=> {
        setAI((cur) => !cur);
        
    }



    useEffect(() => {

        const handleDownloadMp3 = async () => {
            try {
              const URL = `https://songssam.site:8443/song/download?url=origin/${originUrl}`;
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

    useEffect (() => {
        const downloadInstFile = async () => {
            try {
                if(instUrl !== 'null'){
                   const response = await fetch(`https://songssam.site:8443/song/download_inst?url=inst/${instUrl}`); 
                    const blob = await response.blob();
                    const audioURL = URL.createObjectURL(blob); 
                    setAudioSource(audioURL);
                }
                else{
                    setAudioSource('null');
                } 
               
            } catch (error) {
              console.error('파일 다운로드 중 오류 발생:', error);
            }
            finally{
                setLoading(false);
            }
          };
          downloadInstFile();
      },[instUrl]);
    
      useEffect( () => {
        const getRecommendList = async() => {
         try{
            const res = await fetch('https://songssam.site:8443/member/user_recommand_list',{
                headers :{
                    Authorization : `Bearer ${accessToken}`
                }
            });
            const JSON = await res.json();
            setRecommendList(JSON);
            console.log(recommendList);
            }
            catch(e){
                console.log(e);
            }   
        }
        getRecommendList();
        
      },[accessToken]);

      useEffect(()=>{
        const fetchData = async () => {
            try{
                const data = await(await fetch('https://songssam.site:8443/ddsp/sampleVoiceList')).json();
                setAIData(data);
            }
            catch(e){
                console.log(e);
            }
        }
        fetchData();
        
      },[]);

      const clickAI = (id : number) => {

        const data = {
            targetVoiceId : id,
            targetSongId : songId,
        }
        const requestAI = async() => {
            try{
                const res = axios.post('https://songssam.site:8443/ddsp/makesong',data).then(() => alert("성공"));
            }
            catch(e){
                console.log(e);
            }
        }
        requestAI();
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
                        {
                            originUrl === 'null' ? 
                            <UploadLabel>
                                <span>노래 업로드</span>
                                <UploadInput type='file' accept='audio/mpeg'/>
                            </UploadLabel>
                            :
                            <PlayBtn onClick={handlePlay}>노래 듣기</PlayBtn>
                        }

                        <PerfectBtn onClick={handlePerfect}>노래 부르기</PerfectBtn>
                        <AIBtn onClick={handleAI}>AI 커버곡 만들기</AIBtn>

                    </FFlex>  
                </PlayBtnContainer>
                </SongCol>
                
            </SongInfoContainer>
        </SongContainer>
    
       
       {
        originUrl ==='null '  ? 
        
        <SampleButton >
            <span>파일 업로드가 필요합니다</span> 
        </SampleButton>
        :
        null
       }

        <div style={{marginTop : '10px'}}>
        {
            originUrl === 'null' ?
             <UploadFormat Id={Number(songId)}/>
            :
            null
        }
        </div>

        {
            perfect && 
            <PerfectScoreContainer > 
                    <AlertContainer> <span>화면이 좁습니다</span> </AlertContainer>
                    <PerfectScore songId = {songId} audioSource = {audioSource}/>
            </PerfectScoreContainer>
        }

        {
            AI &&
            <WholeWrapper>
            <Overlay onClick={closeAI}></Overlay>
            <AIContainer >
                <AIContainer__Title>
                    <span>원하는 목소리를 선택해주세요</span>
                    <CloseBtn onClick={closeAI} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill='white'  viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                        </svg>
                    </CloseBtn>
                </AIContainer__Title>
                <AIContainer__Grid>
                    {AIData?.map((AI) => 
                    <AIContainer__Grid__Container 
                        key={AI.id}
                        onClick={() => clickAI(AI.id)}
                    >
                        <AIContainer__Grid__Container__flex>
                            <AI_Img ></AI_Img>
                            <AI_NAME>{AI.name}</AI_NAME>
                        </AIContainer__Grid__Container__flex>    
                    </AIContainer__Grid__Container>)}
                </AIContainer__Grid>
            </AIContainer>
            
            </WholeWrapper>
        }

        <OtherTitle>이런 곡은 어떠세요</OtherTitle>
        {
            accessToken &&
            
            <OtherContainer>
            <OtherCol>
            
            <OtherListContainer>
            
                {
                    recommendList && recommendList.map((song,i) => 
                    <OtherList 
                        key={i} 
                        bgpath = {song.imgUrl} 
                        onClick={() => movePage(MakeString(song))}>
                        <Square />
                        <OtherList__title >
                            {song.title}
                        </OtherList__title>
                    </OtherList>
                    )
                }
            </OtherListContainer>
            </OtherCol>
        </OtherContainer>
        }
       </Container>
    </Wrapper>
   
  </Layout>
  )
  
};

