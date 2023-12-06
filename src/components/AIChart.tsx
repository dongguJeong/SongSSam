import styled from "styled-components";
import React, { useEffect,useState,useRef } from "react";
import { IAI_Cover} from "../asset/Interface";
import { useNavigate } from "react-router-dom";
import { MakeString, UseConfirm } from "../asset/functions";
import LoadingCircle from "./LoadingCircle";
import AudioCircle from "./AudioCircle";


const ChartContainer = styled.div`
  width : 100%;  
  border-radius : 15px;
  background-color : white;
  overflow : hidden;
  padding-bottom : 50px;
`;

const ChartBox = styled.div`
  background-color : white;
`;

const SongContainer = styled.div`
  display : flex;
  justify-content : space-between;
  border-bottom : 1px solid #E5E5E5;
  padding-top : 10px;
  padding-bottom : 10px;  
  background-color : white;
`;

const SongColumn = styled.div`
  width : 100%;
  display : flex;
  padding-left : 25px;
  padding-right : 15px;
  justify-content : space-between;
`;

const SongColumnLeft = styled.div`

  display : flex;
  align-items : center;
`

const SongButtonContainer = styled.div`
  text-align : center;
  display : flex;
  align-items : center;
  justify-content : center;
`

const SongImg = styled.img<{bgpath : string}>`
  width : 60px;
  height : 60px;
  background-image : url(${(props) => props.bgpath });
  background-size : cover;
  background-position : center center;
  border-radius : 5px;
  margin-right : 35px;
  cursor : pointer;
`;

const SongDetail = styled.div`
  display : flex;
  align-items : center;

  @media screen and (max-width : 850px){
    flex-direction : column;
    text-align : left;
    align-items : initial;

    span:first-child{
      margin-bottom : 5px;
    }
   }
`;

const SongTitle = styled.span`
  text-align : start;
  width : 300px;
  cursor : pointer;
  font-size : 14px;
   &:hover{
    text-decoration  : underline;
    text-decoration-color: inherent;
    text-decoration-skip: spaces;
    text-underline-offset: 5px; 
    text-decoration-thickness: 1px;
   }  
`;

const Singer = styled.span`
  text-align : start;
  font-size : 14px;
  width : 200px;
  color : #707070;
  cursor : pointer;
  &:hover{
    text-decoration : underline;
    text-decoration-color: inherent;
    text-decoration-skip: spaces;
    text-underline-offset: 5px; 
    text-decoration-thickness: 1px;
  }  
`;


const ChartHeader= styled.div`
  padding-bottom : 10px;
  border-bottom : 1px solid #E5E5E5;
  font-size : 12px;
  color : #707070;

  span:first-child {
    margin-left : 17px;
    margin-right : 120px;
  }

  span:nth-child(2){
    margin-right : 275px; 

    @media screen and (max-width : 850px){
      display : none;
     }
  }

  span:last-child{
    @media screen and (max-width : 850px){
      display : none;
     }
  }
`
const SongRank = styled.div`
  
  font-size : 14px;
  width : 2rem;
  display : flex;
  align-items : center;
  margin-right : 10px;
`

const BlankSpace = styled.div`
  width : 90px;
  background-color : transparent;
`
const Grid = styled.div`
  
  margin-bottom  :30px;
  
`

const AI_Img = styled.img<{imgurl : string}>`
  height : 90px;
  width : 90px;
  background-color : white;
  background-image : url(${props => props.imgurl});
  background-size : contain;
  background-repeat : no-repeat;
`

const Title_Container = styled.div`
  display : flex;

  
`

const Title = styled.span`
  align-self : end;
  font-size : 25px;
  font-weight : 600;
  
 
`



export default function AiChart( {ptrId} : {ptrId : number} ){
  
  const [AiCovers , setAiCover] = useState<IAI_Cover[]>([]);
  const [wavFile, setWavFile] = useState<string[] >([]);
  const [loading, setLoading] = useState(true);
  const [fullLoading, setFullLoading] = useState(true);
  
  const movePage = useNavigate();
  const Ai_Name = ptrId === 52 ? '남자 TTS' : '여자 TTS'

  const downloadWavFile = async (generatedUrl: string) => {
    try {
      const response = await fetch(`https://songssam.site:8443/song/download?url=${generatedUrl}`); 
      const blob = await response.blob();
      const audioSrc =  window.URL.createObjectURL(blob);
      setWavFile((prev) => [...prev, audioSrc]);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const fetchCover = async() => {
      try{
        const res = await fetch(`https://songssam.site:8443/ddsp/generatedSongList?ptrId=${ptrId}`);
        const JSON = await res.json();
        setAiCover(JSON);
        setLoading(false);
        console.log(JSON);
    }
      catch(e){
        console.log(e);
      }
    }
    fetchCover();
  },[ptrId]);

  useEffect(() => {
    const downloadSequentially = async () => {
      if (AiCovers.length > 0 && loading === false) {
        for (let AiCover of AiCovers) {
          await downloadWavFile(AiCover.generatedUrl);
        }
      }
      setFullLoading(false);
    };

    downloadSequentially();
  }, [loading]);

 
  return(
      <>
        <Grid>
         
          <Title_Container>
            <Title>{Ai_Name}</Title> 
          </Title_Container>
        </Grid>
        {
          fullLoading ?
           <LoadingCircle/>
          :
          
          <ChartContainer>
          <ChartHeader>
            <span>목록</span> <span>제목</span> <span>가수</span> 
          </ChartHeader>
          <ChartBox>
            { AiCovers.map((AI ,index : number) => <SongContainer key={index}>
              <SongColumn>
                <SongColumnLeft>
                <SongRank onClick={() => movePage(MakeString(AI.song))}>{index + 1}</SongRank>
                {AI.song.imgUrl ? 
                  <SongImg bgpath = {AI.song.imgUrl}  /> 
                  : 
                  <BlankSpace></BlankSpace> 
                }
                  <SongDetail>
                    <SongTitle onClick={() => movePage(MakeString(AI.song))}>
                        {AI.song.title}           
                    </SongTitle>
                    <Singer onClick={() => movePage(MakeString(AI.song))}>
                        {AI.song.artist}
                    </Singer>
                  </SongDetail>
                  </SongColumnLeft>

                  <SongButtonContainer>
                    <AudioCircle audioSrc={wavFile[index]}/>
                  </SongButtonContainer>
              </SongColumn>
            </SongContainer>)}
          </ChartBox>
          </ChartContainer> 
        }
    </>
    )
 };
