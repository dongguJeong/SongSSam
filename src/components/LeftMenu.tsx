import React from "react";
import styled from "styled-components";
import "../styles/font.css";
import '../styles/global.css';
import { useLocation, useNavigate} from "react-router-dom";
import SearchBBar from "./SearchBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


const Wrapper = styled.div`

    width : var(--LeftMenu-width);
    min-height : 100vh;
    position : fixed ;
    top : 0;
    left : 0;
    display : flex;
    background-color : #F9F9F9;
    color : black;
    border-right : 1px solid rgba(0,0,0,.15);

    
`;

const Container = styled.div`

    width : 100%;
    height : 100%;
    padding : 10px 25px;
    
    
`
const ItemList = styled.ul``;


const HeaderContainer = styled.div`
    display : flex;
    padding-top : 7px;
    margin-bottom : 20px;
`

const HeaderTitle = styled.span`
  padding-left : 5px;
  font-size : 22px;
  font-weight : 500; 
`

const Item = styled.li`
    width : 100%;
    padding : 10px 5px;
    display : flex;
    align-items : center;
    cursor : pointer;
    font-size : 14px;
    font-weight : 400;
    

    &:hover{
        background-color : #E6E6E7;
        border-radius : 10px;
        color : #010043;
        
    }

    svg{
        color : var(--iconColor);
        height : 14px; 
        margin-right : 10px;
    }

    
`



function LeftMenu(){

    const move = useNavigate();

    
    const location = useLocation();


    const goMypage = () => {
        
            move('/mypage');
        
    }

    const alertMypage = () => [
        alert("로그인이 필요합니다"),
        move('/')
    ] 


    const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);


    return (
        <Wrapper>
         <Container>
         <HeaderContainer>
             <HeaderTitle >SongSSam</HeaderTitle>
         </HeaderContainer>
          <ItemList>

            <SearchBBar />
         
            <Item onClick={() => move("/")} 
                  style = {{backgroundColor : location.pathname === '/' ? '#E6E6E7 ' : 'transparent' ,
                            borderRadius : '10px',
                            }}>

            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
                <span >노래 검색하기</span>
            </Item>
            
            <Item onClick={accessToken ? goMypage : alertMypage}
                  style = {{backgroundColor : location.pathname === '/mypage' ? '#E6E6E7 ' : 'transparent' ,
                  borderRadius : '10px',
                  }}
            >
                <svg  fill="currentColor" xmlns="http://www.w3.org/2000/svg" strokeWidth="2"  viewBox="0 0 448 512">
                    <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                </svg>

                <span>내 정보</span>
            </Item>


            <Item onClick={() => move("/prefer")}>
                <span >선호하는 노래 조사(임시)</span>

            </Item>

          </ItemList>
         </Container>
        </Wrapper>
    )
}

export default LeftMenu;