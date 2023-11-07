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
    padding : 0px 25px;
    padding-top : 10px;
    padding-bottom : 10px;
    
    
`
const ItemList = styled.ul``;


const HeaderContainer = styled.div`
    
    display : flex;
    margin-bottom : 20px;
`



const Item = styled.li<{location : true | false}>`
    width : 100%;
    padding : 10px 5px;
    display : flex;
    align-items : center;
    cursor : pointer;
    font-size : 14px;
    font-weight : 400;
    background-color : ${props => (props.location ? '#E6E6E7' : 'transparent')};
    border-radius : 10px;

    &:hover{
        background-color : #E6E6E7;
        
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
         <svg width="71" height="35" viewBox="0 0 71 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5977 29.6172C17.5977 29.0703 17.513 28.582 17.3438 28.1523C17.1875 27.7096 16.8945 27.3125 16.4648 26.9609C16.0482 26.5964 15.4557 26.2448 14.6875 25.9062C13.9323 25.5547 12.9557 25.1901 11.7578 24.8125C10.4297 24.3958 9.19271 23.9271 8.04688 23.4062C6.90104 22.8854 5.89193 22.2799 5.01953 21.5898C4.16016 20.8997 3.48958 20.1055 3.00781 19.207C2.52604 18.2956 2.28516 17.2409 2.28516 16.043C2.28516 14.8711 2.53255 13.8034 3.02734 12.8398C3.53516 11.8763 4.2513 11.0495 5.17578 10.3594C6.10026 9.65625 7.1875 9.11589 8.4375 8.73828C9.70052 8.36068 11.0938 8.17188 12.6172 8.17188C14.7266 8.17188 16.5495 8.55599 18.0859 9.32422C19.6354 10.0924 20.8333 11.1341 21.6797 12.4492C22.526 13.7643 22.9492 15.2422 22.9492 16.8828H17.5977C17.5977 15.9974 17.4089 15.2161 17.0312 14.5391C16.6667 13.862 16.1068 13.3281 15.3516 12.9375C14.6094 12.5469 13.6719 12.3516 12.5391 12.3516C11.4453 12.3516 10.5339 12.5143 9.80469 12.8398C9.08854 13.1654 8.54818 13.6081 8.18359 14.168C7.83203 14.7279 7.65625 15.3529 7.65625 16.043C7.65625 16.5638 7.77995 17.0326 8.02734 17.4492C8.27474 17.8529 8.64583 18.237 9.14062 18.6016C9.63542 18.9531 10.2474 19.2852 10.9766 19.5977C11.7188 19.8971 12.5781 20.1966 13.5547 20.4961C15.1172 20.9648 16.4844 21.4857 17.6562 22.0586C18.8411 22.6315 19.8242 23.2826 20.6055 24.0117C21.3997 24.7409 21.9922 25.5612 22.3828 26.4727C22.7865 27.3841 22.9883 28.4193 22.9883 29.5781C22.9883 30.8021 22.7474 31.8958 22.2656 32.8594C21.7839 33.8229 21.0938 34.6432 20.1953 35.3203C19.2969 35.9974 18.2161 36.5117 16.9531 36.8633C15.7031 37.2148 14.3034 37.3906 12.7539 37.3906C11.3737 37.3906 10.0065 37.2083 8.65234 36.8438C7.3112 36.4661 6.09375 35.9062 5 35.1641C3.90625 34.4089 3.03385 33.4583 2.38281 32.3125C1.73177 31.1536 1.40625 29.7995 1.40625 28.25H6.79688C6.79688 29.1484 6.9401 29.9167 7.22656 30.5547C7.52604 31.1797 7.94271 31.694 8.47656 32.0977C9.02344 32.4883 9.66146 32.7747 10.3906 32.957C11.1198 33.1393 11.9076 33.2305 12.7539 33.2305C13.8477 33.2305 14.7461 33.0807 15.4492 32.7812C16.1654 32.4688 16.6992 32.0391 17.0508 31.4922C17.4154 30.9453 17.5977 30.3203 17.5977 29.6172Z" fill="black"/>
<path d="M27.3228 17.8242V17.6191C27.3228 16.8444 27.4335 16.1315 27.6548 15.4805C27.8762 14.8229 28.1985 14.2533 28.6216 13.7715C29.0448 13.2897 29.5624 12.9154 30.1744 12.6484C30.7864 12.375 31.483 12.2383 32.2642 12.2383C33.0585 12.2383 33.7616 12.375 34.3736 12.6484C34.9921 12.9154 35.5129 13.2897 35.9361 13.7715C36.3593 14.2533 36.6815 14.8229 36.9029 15.4805C37.1242 16.1315 37.2349 16.8444 37.2349 17.6191V17.8242C37.2349 18.5924 37.1242 19.3053 36.9029 19.9629C36.6815 20.6139 36.3593 21.1836 35.9361 21.6719C35.5129 22.1536 34.9953 22.528 34.3834 22.7949C33.7714 23.0618 33.0715 23.1953 32.2838 23.1953C31.5025 23.1953 30.8026 23.0618 30.1841 22.7949C29.5657 22.528 29.0448 22.1536 28.6216 21.6719C28.1985 21.1836 27.8762 20.6139 27.6548 19.9629C27.4335 19.3053 27.3228 18.5924 27.3228 17.8242ZM29.9009 17.6191V17.8242C29.9009 18.2865 29.9465 18.7194 30.0377 19.123C30.1288 19.5267 30.2688 19.8815 30.4576 20.1875C30.6464 20.4935 30.8905 20.7344 31.19 20.9102C31.496 21.0794 31.8606 21.1641 32.2838 21.1641C32.7004 21.1641 33.0585 21.0794 33.358 20.9102C33.6575 20.7344 33.9016 20.4935 34.0904 20.1875C34.2857 19.8815 34.4289 19.5267 34.5201 19.123C34.6112 18.7194 34.6568 18.2865 34.6568 17.8242V17.6191C34.6568 17.1634 34.6112 16.737 34.5201 16.3398C34.4289 15.9362 34.2857 15.5814 34.0904 15.2754C33.9016 14.9629 33.6542 14.7188 33.3482 14.543C33.0487 14.3607 32.6874 14.2695 32.2642 14.2695C31.8476 14.2695 31.4895 14.3607 31.19 14.543C30.8905 14.7188 30.6464 14.9629 30.4576 15.2754C30.2688 15.5814 30.1288 15.9362 30.0377 16.3398C29.9465 16.737 29.9009 17.1634 29.9009 17.6191ZM41.6392 14.6895V23H39.0611V12.4336H41.483L41.6392 14.6895ZM41.2291 17.3359H40.4673C40.4739 16.5677 40.578 15.8711 40.7798 15.2461C40.9817 14.6211 41.2649 14.084 41.6295 13.6348C42.0005 13.1855 42.44 12.8405 42.9478 12.5996C43.4556 12.3587 44.022 12.2383 44.647 12.2383C45.1548 12.2383 45.6138 12.3099 46.024 12.4531C46.4341 12.5964 46.7857 12.8242 47.0787 13.1367C47.3782 13.4492 47.606 13.8594 47.7623 14.3672C47.925 14.8685 48.0064 15.487 48.0064 16.2227V23H45.4088V16.2031C45.4088 15.7214 45.3371 15.3405 45.1939 15.0605C45.0572 14.7806 44.8554 14.582 44.5884 14.4648C44.328 14.3477 44.0058 14.2891 43.6216 14.2891C43.2245 14.2891 42.8762 14.3704 42.5767 14.5332C42.2838 14.6895 42.0364 14.9076 41.8345 15.1875C41.6392 15.4674 41.4895 15.7897 41.3853 16.1543C41.2811 16.5189 41.2291 16.9128 41.2291 17.3359ZM57.0005 12.4336H59.3443V22.6777C59.3443 23.6348 59.136 24.4453 58.7193 25.1094C58.3091 25.7799 57.733 26.2878 56.9908 26.6328C56.2486 26.9844 55.386 27.1602 54.4029 27.1602C53.9797 27.1602 53.5207 27.1016 53.0259 26.9844C52.5377 26.8672 52.0657 26.6816 51.6099 26.4277C51.1607 26.1803 50.7864 25.8581 50.4869 25.4609L51.649 23.9375C52.0005 24.3477 52.3977 24.6569 52.8404 24.8652C53.2831 25.0801 53.7616 25.1875 54.2759 25.1875C54.7968 25.1875 55.2395 25.0898 55.6041 24.8945C55.9752 24.7057 56.2584 24.4258 56.4537 24.0547C56.6555 23.6901 56.7564 23.2409 56.7564 22.707V14.8457L57.0005 12.4336ZM49.8619 17.8438V17.6387C49.8619 16.8314 49.9595 16.099 50.1548 15.4414C50.3502 14.7773 50.6301 14.2077 50.9947 13.7324C51.3658 13.2572 51.8117 12.8893 52.3326 12.6289C52.8599 12.3685 53.4524 12.2383 54.1099 12.2383C54.8065 12.2383 55.3925 12.3652 55.8677 12.6191C56.3495 12.873 56.7466 13.2344 57.0591 13.7031C57.3782 14.1719 57.6255 14.7285 57.8013 15.373C57.9836 16.0111 58.1236 16.7142 58.2213 17.4824V18.0391C58.1301 18.7878 57.9836 19.4746 57.7818 20.0996C57.5865 20.7246 57.3261 21.2715 57.0005 21.7402C56.675 22.2025 56.2714 22.5605 55.7896 22.8145C55.3078 23.0684 54.7414 23.1953 54.0904 23.1953C53.4394 23.1953 52.8534 23.0618 52.3326 22.7949C51.8117 22.528 51.3658 22.1536 50.9947 21.6719C50.6301 21.1901 50.3502 20.6237 50.1548 19.9727C49.9595 19.3216 49.8619 18.612 49.8619 17.8438ZM52.44 17.6387V17.8438C52.44 18.2995 52.4856 18.7259 52.5767 19.123C52.6679 19.5202 52.8078 19.8717 52.9966 20.1777C53.1854 20.4772 53.4231 20.7116 53.7095 20.8809C53.996 21.0501 54.3378 21.1348 54.7349 21.1348C55.2688 21.1348 55.705 21.0241 56.0435 20.8027C56.3886 20.5749 56.649 20.2656 56.8248 19.875C57.0071 19.4779 57.1242 19.0319 57.1763 18.5371V17.0039C57.1438 16.6133 57.0722 16.252 56.9615 15.9199C56.8573 15.5879 56.7108 15.3014 56.522 15.0605C56.3332 14.8197 56.0923 14.6309 55.7994 14.4941C55.5064 14.3574 55.1581 14.2891 54.7545 14.2891C54.3638 14.2891 54.022 14.377 53.7291 14.5527C53.4361 14.722 53.1952 14.9596 53.0064 15.2656C52.8176 15.5716 52.6744 15.9264 52.5767 16.3301C52.4856 16.7337 52.44 17.1699 52.44 17.6387Z" fill="black"/>
<path d="M33.5923 36.1123C33.5923 35.891 33.5338 35.6924 33.4166 35.5166C33.2994 35.3409 33.078 35.1813 32.7525 35.0381C32.4335 34.8884 31.9647 34.7484 31.3463 34.6182C30.7994 34.501 30.2948 34.3545 29.8326 34.1787C29.3703 34.003 28.9732 33.7914 28.6412 33.544C28.3091 33.2901 28.0487 32.9938 27.8599 32.6553C27.6776 32.3103 27.5865 31.9131 27.5865 31.4639C27.5865 31.0277 27.6809 30.6175 27.8697 30.2334C28.0585 29.8428 28.3319 29.501 28.69 29.208C29.0481 28.9086 29.4843 28.6742 29.9986 28.5049C30.5129 28.3291 31.0923 28.2412 31.7369 28.2412C32.6353 28.2412 33.4068 28.3877 34.0513 28.6807C34.7024 28.9737 35.2004 29.3773 35.5455 29.8916C35.8905 30.3994 36.063 30.9724 36.063 31.6104H33.4849C33.4849 31.3304 33.4198 31.0765 33.2896 30.8487C33.1659 30.6208 32.9739 30.4385 32.7134 30.3018C32.453 30.1586 32.1242 30.0869 31.7271 30.0869C31.369 30.0869 31.0663 30.1455 30.8189 30.2627C30.578 30.3799 30.3957 30.5329 30.272 30.7217C30.1483 30.9105 30.0865 31.1188 30.0865 31.3467C30.0865 31.516 30.119 31.669 30.1841 31.8057C30.2558 31.9359 30.3697 32.0563 30.5259 32.167C30.6822 32.2777 30.8938 32.3786 31.1607 32.4698C31.4341 32.5609 31.7694 32.6488 32.1666 32.7334C32.9543 32.8897 33.6412 33.098 34.2271 33.3584C34.8196 33.6123 35.2818 33.9509 35.6138 34.3741C35.9459 34.7972 36.1119 35.3376 36.1119 35.9951C36.1119 36.4639 36.011 36.8936 35.8091 37.2842C35.6073 37.6683 35.3144 38.0036 34.9302 38.2901C34.5461 38.5765 34.0871 38.8011 33.5533 38.9639C33.0194 39.1201 32.4172 39.1983 31.7466 39.1983C30.7766 39.1983 29.9563 39.0257 29.2857 38.6807C28.6151 38.3291 28.1073 37.8864 27.7623 37.3526C27.4172 36.8122 27.2447 36.2523 27.2447 35.6729H29.7154C29.7349 36.083 29.8456 36.4118 30.0474 36.6592C30.2492 36.9066 30.5032 37.0856 30.8091 37.1963C31.1216 37.3005 31.4504 37.3526 31.7955 37.3526C32.1861 37.3526 32.5149 37.3005 32.7818 37.1963C33.0487 37.0856 33.2505 36.9392 33.3873 36.7569C33.524 36.5681 33.5923 36.3532 33.5923 36.1123ZM43.8951 36.7569V31.8838C43.8951 31.5257 43.8332 31.2165 43.7095 30.9561C43.5858 30.6957 43.397 30.4938 43.1431 30.3506C42.8892 30.2074 42.567 30.1358 42.1763 30.1358C41.8313 30.1358 41.5285 30.1944 41.2681 30.3116C41.0142 30.4287 40.8189 30.5948 40.6822 30.8096C40.5455 31.0179 40.4771 31.2588 40.4771 31.5323H37.8892C37.8892 31.0961 37.9934 30.6826 38.2017 30.292C38.4101 29.8949 38.7063 29.5433 39.0904 29.2373C39.481 28.9248 39.9465 28.6807 40.4869 28.5049C41.0338 28.3291 41.6457 28.2412 42.3228 28.2412C43.1236 28.2412 43.8365 28.378 44.4615 28.6514C45.093 28.9183 45.5878 29.322 45.9459 29.8623C46.3104 30.4027 46.4927 31.083 46.4927 31.9034V36.5127C46.4927 37.0401 46.5253 37.4925 46.5904 37.8701C46.662 38.2412 46.7662 38.5635 46.9029 38.8369V39.003H44.2759C44.1522 38.736 44.0578 38.3975 43.9927 37.9873C43.9276 37.5707 43.8951 37.1605 43.8951 36.7569ZM44.2564 32.5674L44.2759 34.1006H42.6451C42.2414 34.1006 41.8866 34.1429 41.5806 34.2276C41.2746 34.3057 41.024 34.4229 40.8287 34.5791C40.6334 34.7289 40.4869 34.9112 40.3892 35.126C40.2916 35.3343 40.2427 35.572 40.2427 35.8389C40.2427 36.0993 40.3013 36.3337 40.4185 36.542C40.5422 36.7504 40.718 36.9164 40.9459 37.0401C41.1802 37.1573 41.4537 37.2159 41.7662 37.2159C42.2219 37.2159 42.619 37.1247 42.9576 36.9424C43.2961 36.7536 43.5598 36.5257 43.7486 36.2588C43.9374 35.9919 44.0383 35.738 44.0513 35.4971L44.7935 36.6104C44.7024 36.8773 44.5657 37.1605 44.3834 37.46C44.2011 37.7595 43.9667 38.0394 43.6802 38.2998C43.3938 38.5603 43.0487 38.7751 42.6451 38.9444C42.2414 39.1136 41.7727 39.1983 41.2388 39.1983C40.5552 39.1983 39.9433 39.0616 39.4029 38.7881C38.8625 38.5147 38.4361 38.1403 38.1236 37.6651C37.8111 37.1898 37.6548 36.6494 37.6548 36.044C37.6548 35.4841 37.759 34.9893 37.9673 34.5596C38.1757 34.1299 38.4849 33.7686 38.8951 33.4756C39.3052 33.1761 39.813 32.9515 40.4185 32.8018C41.0305 32.6455 41.7304 32.5674 42.5181 32.5674H44.2564ZM51.3853 30.6045V39.003H48.8072V28.4366H51.2388L51.3853 30.6045ZM51.0045 33.3389H50.2134C50.2134 32.6032 50.3013 31.9261 50.4771 31.3076C50.6594 30.6892 50.9263 30.152 51.2779 29.6963C51.6295 29.2341 52.0624 28.876 52.5767 28.6221C53.0976 28.3682 53.6998 28.2412 54.3834 28.2412C54.8586 28.2412 55.2948 28.3129 55.692 28.4561C56.0891 28.5928 56.4309 28.8109 56.7173 29.1104C57.0103 29.4034 57.2349 29.7875 57.3912 30.2627C57.5474 30.7315 57.6255 31.2946 57.6255 31.9522V39.003H55.0474V32.2159C55.0474 31.7211 54.9758 31.3337 54.8326 31.0537C54.6959 30.7738 54.4973 30.5785 54.2369 30.4678C53.9765 30.3506 53.664 30.292 53.2994 30.292C52.8957 30.292 52.5474 30.3734 52.2545 30.5362C51.968 30.6924 51.7304 30.9105 51.5416 31.1905C51.3593 31.4704 51.2226 31.7927 51.1314 32.1573C51.0468 32.5218 51.0045 32.9157 51.0045 33.3389ZM57.4302 32.8604L56.3658 33.0557C56.3723 32.3916 56.4634 31.7699 56.6392 31.1905C56.815 30.6045 57.0722 30.0935 57.4107 29.6573C57.7558 29.2145 58.1822 28.8695 58.69 28.6221C59.2043 28.3682 59.7968 28.2412 60.4673 28.2412C60.9882 28.2412 61.4569 28.3161 61.8736 28.4659C62.2968 28.6091 62.6581 28.8402 62.9576 29.1592C63.2571 29.4717 63.4849 29.8786 63.6412 30.3799C63.8039 30.8812 63.8853 31.4932 63.8853 32.2159V39.003H61.2877V32.2061C61.2877 31.6918 61.216 31.2979 61.0728 31.0244C60.9361 30.751 60.7375 30.5622 60.4771 30.458C60.2167 30.3474 59.9107 30.292 59.5591 30.292C59.2011 30.292 58.8886 30.3604 58.6216 30.4971C58.3612 30.6273 58.1399 30.8096 57.9576 31.044C57.7818 31.2784 57.6483 31.5518 57.5572 31.8643C57.4726 32.1703 57.4302 32.5023 57.4302 32.8604Z" fill="black"/>
</svg>

            
         </HeaderContainer>
          <ItemList>

            <SearchBBar />
         
            <Item onClick={() => move("/")} 
                  location = {location.pathname === '/' ? true : false}
            >

            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
                <span >노래 검색하기</span>
            </Item>
            
            <Item onClick={accessToken ? goMypage : alertMypage}
                  location = {location.pathname === '/mypage' ? true : false}
            >
                <svg  fill="currentColor" xmlns="http://www.w3.org/2000/svg" strokeWidth="2"  viewBox="0 0 448 512">
                    <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                </svg>

                <span>내 정보</span>
            </Item>


            <Item onClick={() => move("/prefer")}
                  location = {false}
            >
                <span >선호하는 노래 조사(임시)</span>

            </Item>

          </ItemList>
         </Container>
        </Wrapper>
    )
}

export default LeftMenu;