import Layout from "../components/Layout";
import React from "react";
import styled from "styled-components";
import BigTitle from "../components/BigTitle";

import UploadFormat from "../components/UploadFormat";

const Wrapper = styled.div`
    margin : 0 auto;
    padding : 0 40px;
  `


export default function Upload (){

    return(
        <Layout>
            <Wrapper>
            <BigTitle title = '노래 업로드'/>
            <UploadFormat/>
            </Wrapper>
        </Layout>
    )
}