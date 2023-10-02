import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";

const ChartContainer = styled.div`
  width : 100%;  
  box-shadow : 0px 4px 6px -1px rgb(0,0,0,.3);
  border-radius : 15px;
  padding : 20px;
  background-color : white;
  padding-top : 40px;
  overflow : hidden;

`;

const ChartTitle = styled.h1`
  font-size : 30px;
  margin-bottom : 40px;
  font-weight : 500;
  color : --var(fontBlue);
`;

const ChartBox = styled.div`

  background-color : white;
  
`;

const SongContainer = styled.div`
  display : flex;
  justify-content : space-between;
  border-bottom : 1px solid #008EF5;
  
  padding-top : 15px;
  padding-bottom : 15px;  
  margin-bottom : 7px;
  background-color : white;
  
`;

const SongColumn = styled.div`
  display : flex;
  align-items : center;
  padding-left : 25px;
  padding-right : 15px;
`;

const SongImg = styled.img<{bgpath : string}>`
  width : var(--Chart-imgSize);
  height : var(--Chart-imgSize);
  background-image : url(${(props) => props.bgpath });
  background-size : cover;
  background-position : center center;
  border-radius : 5px;
  margin-right : var(--Chart-img-Margin-right);
`;


const SongDetail = styled.div`
  display : flex;
  align-items : center;
  
`;

const SongTitle = styled.h3`
  
  text-align : start;
  width : 300px;
  cursor : pointer;

   a:hover{
    text-decoration  : underline;
   }
  
`;
const Singer = styled.h3`
  text-align : start;
  width : 130px;

`;

const SongButton = styled.button`
  cursor : pointer;
  height : 40px;
  border-radius : 5px;
  width : 140px;
  
  background-color : #80FF01;
  border : none;
  filter : drop-shadow(5px 5px 5px #CCCCCC);

  a:{
    width : 100%;
    height : 100%;
    display : flex;
    justify-content : center;
    align-items : center;
    padding : 20px;

  }

  a:hover{
    
    text-decoration : underline;
  }
`;

const ChartHeader= styled.div`
  padding-bottom : 10px;
  border-bottom : 1px solid var(--iconColor);
  span:first-child {
    margin-left : 17px;
    margin-right : 110px;  
    
  }

  span:nth-child(2){
    margin-right : 270px; 
    font-size : var(--ChartHeader-Title-fontSize);
  }

  span:last-child{
    
    font-size : var(--ChartHeader-Singer-fontSize);
  }
  
`
const SongRank = styled.div`
  
  font-size : 20px;
  width : 2rem;
  display : flex;
  align-items : center;
  margin-right : 10px;
`

export interface IData{
  id : number,
  title : string,
  imgUrl : string ,
  artist : string,
  genre : string,
}

export interface IChart {
    title : string;
    btnTitle : string;
    data : IData[];
}


const BlackSpace = styled.div`
  width : 90px;
  background-color : transparent;
`

export default function Chart( {title,btnTitle,data}: IChart  ){
  
  
    return(

        
        <ChartContainer>
          <ChartTitle >{title}</ChartTitle>
          <ChartHeader>
            <span>순위</span> <span>제목</span> <span>가수</span> 
          </ChartHeader>
          <ChartBox>
            { data.map((song ,index : number) => <SongContainer key={song.id}>
              <SongColumn>
                <SongRank>{index + 1}</SongRank>
                {song.imgUrl ? <SongImg bgpath = {song.imgUrl} /> : <BlackSpace></BlackSpace> }
                  <SongDetail>
                    <SongTitle>
                      <Link to={`/detail/${song.artist}/${song.title}/${encodeURIComponent(song.imgUrl)}`} >
                        {song.title}
                      </Link>
                    </SongTitle>
                    <Singer>{song.artist}</Singer>
                  </SongDetail>
              </SongColumn>

              <SongColumn>
                <SongButton>
                  <Link to={`/detail/${song.artist}/${song.title}/${song.id}/${encodeURIComponent(song.imgUrl)}`} > {btnTitle} </Link>
                </SongButton>
              </SongColumn>
            </SongContainer>)}

          </ChartBox>
        </ChartContainer>
    );
 };


 

  
