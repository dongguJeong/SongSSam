import React from "react";
import styled from "styled-components";

const Title = styled.div<{paddingTop? : string}>`
    width : 100%;  
    background-color : white;
    padding-top : ${(props) => (props.paddingTop === 'no' ?  '0px' : '60px')};
    font-size : 34px;
    margin-bottom : 30px;
    font-weight : 600; 
`;

export default function BigTitle({title , paddingTop} : {title : string , paddingTop?  : string}) {

    return (
        <Title paddingTop={paddingTop?.toString()}>
            <span>
            {title}
            </span>
        </Title>
    )

}