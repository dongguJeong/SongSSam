import styled from "styled-components";
import React, { useEffect,useState } from "react";
import { IAI_Cover } from "../asset/Interface";

const ChartContainer = styled.div`
  width : 100%;  
  border-radius : 15px;
  background-color : white;
  overflow : hidden;
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

const SongButton = styled.button`
  
  cursor : pointer;
  height : 40px;
  border-radius : 5px;
  width : 120px;
  background-color :  var(--iconColor);
  border : none;
  color : white;

  &:hover{
    box-shadow: 0px 4px 6px -1px rgb(0, 0, 0, .3);
    transform: translate(-3px, -3px);
    transition : transform 0.2s ease-in;
  }
  
  a:{
    font-size : 14px;
    width : 100%;
    height : 100%;
    display : flex;
    justify-content : center;
    align-items : center;
    padding : 20px 30px;

  }

  @media screen and (max-width : 900px){
    display : none;
  }
`;


const RedButton = styled(SongButton)`
  color : black;
  background-color :  #F6B941;
`


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

export default function AI_Chart(){

    const [coverData , setCoverData] = useState<IAI_Cover[]>([]);
    
   
    return(
        <ChartContainer>
          <ChartHeader>
            <span>목록</span> <span>제목</span> <span>AI가수</span> <span>원곡가수</span> <span>노래듣기</span>
          </ChartHeader>
          <ChartBox>
            { [1,2,3,4].map((song ,index : number) => <SongContainer key={song.id}>
              <SongColumn>
                <SongColumnLeft>
                <SongRank>{index + 1}</SongRank>
                {song.imgUrl ? 
                  <SongImg bgpath = {song.imgUrl} /> 
                  : 
                  <BlankSpace></BlankSpace> 
                }
                  <SongDetail>
                    <SongTitle 
                      
                    >
                        {song.title}           
                    </SongTitle>
                    <Singer 
                    >
                        {song.artist}
                    </Singer>
                  </SongDetail>
                  </SongColumnLeft>

                  <SongButtonContainer>
                      
                      <audio controls></audio>
                      
                  </SongButtonContainer>
              </SongColumn>
            </SongContainer>)}
          </ChartBox>
        </ChartContainer>
    );
 };


 

  
