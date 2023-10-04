import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { styled } from 'styled-components';
import "../styles/global.css";
import PerfectScore from '../components/PerfectScore';
import { useParams } from 'react-router-dom';

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
    align-self : center;
    width : 100%;

    @media screen and (max-width : 900px){
        margin-top : 10px;
        align-self : initial;
        align-items : center;
        justify-content : center;
    }
    
`;

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



export default function Detail() {

    const {title, singer,imgUrl,songId} = useParams();
    const [perfect,setPerfect] = useState(false);


    const handlePerfect = () => {
        setPerfect((cur) => !cur);
    }
    

  return (
  <Layout>
     <Wrapper>
       <Container>
        <SongContainer>
            <SongImg src={imgUrl} alt='Song Image'/>
            <SongInfoContainer>
                <SongCol>
                    <SongTitle>
                        <span>{title}</span>
                    </SongTitle>
                    <Singer>
                        <span>{singer}</span>
                    </Singer>
                </SongCol>
                
                
            </SongInfoContainer>

        </SongContainer>

        <SampleButton>
                    <span>샘플링이 필요합니다</span> 
        </SampleButton>
        <SampleButton onClick={handlePerfect}>
                    <span>퍼펙트 스코어</span> 
        </SampleButton>

        {
            perfect &&
            <PerfectScoreContainer > 
                    <AlertContainer> <span>화면이 좁습니다</span> </AlertContainer>
                    <PerfectScore songId = {songId}/>
            </PerfectScoreContainer>

        }
        



        <OtherContainer>
            <OtherCol>
            <OtherTitle>비슷한 음역대의 다른 곡</OtherTitle>
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
  
}

