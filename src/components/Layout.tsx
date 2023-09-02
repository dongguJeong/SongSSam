import React from "react";
import Header from "./Header";
import styled from "styled-components";
import LeftMenu from "./LeftMenu";

const Wrapper = styled.div`
`

const Container = styled.div`
    left : 260px;
    position : absolute ;
    top : 55px;
    width : calc(100vw - 260px) ;
    
    min-height : 100vh;
    background-color : #F9FAFB;
    
`;

function Layout(props : {children : React.ReactNode}){

    return(
        <div>
            <LeftMenu/>
            <Wrapper>
                <Header/>
                <Container>
                    {props.children}
                </Container>
            </Wrapper>
        </div>
    )

}

export default Layout;